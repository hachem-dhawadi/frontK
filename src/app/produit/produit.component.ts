import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService, Product } from '../Service/produit.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  selectedFile: File | null = null;
  showForm = false;
  isLoading = false;
  selectedProductId?: number;

  constructor(
    private produitService: ProduitService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.required, Validators.maxLength(20)]],
      discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [true],
      imageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  // Form control getters
  get f() {
    return this.productForm.controls;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  // Data loading methods
  loadAllProducts(): void {
    this.isLoading = true;
    this.produitService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  loadProductById(id: number): void {
    this.isLoading = true;
    this.produitService.getProductById(id).subscribe({
      next: (product) => {
        this.selectedProductId = product.id;
        this.productForm.patchValue(product);
        this.showForm = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.isLoading = false;
      }
    });
  }

  // Form actions
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.productForm.reset({
      name: '',
      brand: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      sku: '',
      discountPercentage: 0,
      isActive: true,
      imageUrl: ''
    });
    this.selectedProductId = undefined;
    this.selectedFile = null;
  }

  // CRUD operations
// Modify the createProduct and updateSelectedProduct methods
createProduct(): void {
  // Mark all fields as touched
  this.productForm.markAllAsTouched();

  // Check validity after marking as touched
  if (this.productForm.invalid) {
    console.log('Form is invalid, showing errors');
    return;
  }

  this.isLoading = true;
  this.produitService.addProduct(this.productForm.value).subscribe({
    next: () => {
      this.loadAllProducts();
      this.cancelForm();
    },
    error: (err) => {
      console.error('Error creating product:', err);
      this.isLoading = false;
    }
  });
}

updateSelectedProduct(): void {
  // Mark all fields as touched
  this.productForm.markAllAsTouched();

  // Check validity after marking as touched
  if (this.productForm.invalid || !this.selectedProductId) {
    console.log('Form is invalid, showing errors');
    return;
  }

  this.isLoading = true;
  this.produitService.updateProduct(this.selectedProductId, this.productForm.value).subscribe({
    next: () => {
      this.loadAllProducts();
      this.cancelForm();
    },
    error: (err) => {
      console.error('Error updating product:', err);
      this.isLoading = false;
    }
  });
}

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      this.produitService.deleteProduct(id).subscribe({
        next: () => this.loadAllProducts(),
        error: (err) => {
          console.error('Error deleting product:', err);
          this.isLoading = false;
        }
      });
    }
  }

  // Image handling
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.produitService.uploadProductImage(this.selectedFile).subscribe({
      next: (fileName) => {
        this.productForm.patchValue({ imageUrl: fileName });
        this.selectedFile = null;
        (document.getElementById('fileInput') as HTMLInputElement).value = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        this.isLoading = false;
      }
    });
  }
}