import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  stockQuantity: number;
  discountPercentage: number;
  isActive: boolean;
  sku: string;
  imageUrl?: string;
  category?: any; // Update with correct type if available
}

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private apiUrl = 'http://localhost:8089/api/prod/products';

  constructor(private http: HttpClient) { }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/`, product);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

// Modify the uploadProductImage method
uploadProductImage(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(`${this.apiUrl}/upload`, formData, { 
    responseType: 'text' 
  }).pipe(
    map(response => {
      // Extract just the filename from the response
      const parts = response.split(': ');
      return parts.length > 1 ? parts[1].trim() : response;
    })
  );
}
}