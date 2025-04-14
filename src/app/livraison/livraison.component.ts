import { Component, OnInit } from '@angular/core';
import { LivraisonService } from '../Service/livraison.service';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
  livraisons: any[] = [];
  commandes: any[] = [];
  livraison: any = {
    statusl: '',
    orderdate: '',
    commande: { idcommande: null }
  };
  isEditing = false;
  showForm = false;

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    this.loadLivraisons();
    this.loadCommandes();
  }

  loadLivraisons(): void {
    this.livraisonService.getAllLivraisons().subscribe((data) => {
      this.livraisons = data;
    });
  }

  loadCommandes(): void {
    this.livraisonService.getAllCommandes().subscribe((data) => {
      this.commandes = data;
    });
  }

    // Show or hide the form
    toggleForm(): void {
      this.showForm = !this.showForm;
      this.isEditing = false;
      this.livraison = { statusl: '', orderdate: '', commande: { idcommande: null } };
    }

      // Start editing a livraison
  editLivraison(livraison: any): void {
    this.livraison = { ...livraison };
    this.showForm = true;
    this.isEditing = true;
  }

  // Format the date as yyyy-MM-dd HH:mm:ss
  formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ` +
           `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }

  onSubmit(): void {
    if (!this.livraison.commande || !this.livraison.commande.idcommande) {
      console.error('Commande ID is required');
      return;
    }

    const payload = {
      statusl: this.livraison.statusl,
      orderdate: this.formatDate(this.livraison.orderdate),
      commande: { idcommande: this.livraison.commande.idcommande }
    };

    console.log('Payload:', payload);

    if (this.isEditing) {
      // Update existing livraison
      this.livraisonService.modifyLivraison(this.livraison).subscribe(
        response => {
          this.loadLivraisons();  // Reload list after update
          this.cancelForm();      // Reset the form
        },
        error => {
          console.error('Error updating livraison:', error);
        }
      );
    } else {
      this.livraisonService.addLivraison(payload).subscribe(() => {
        this.loadLivraisons();
        this.resetForm();
      });
    }
  }

  deleteLivraison(id: number): void {
    this.livraisonService.deleteLivraison(id).subscribe(() => {
      this.loadLivraisons();
    });
  }

  resetForm(): void {
    this.livraison = { statusl: '', orderdate: '' };
    this.isEditing = false;
    this.showForm = false;
  }

  // Cancel form and reset
  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.livraison = { statusl: '', orderdate: '', commande: { idcommande: null } };
  }

}
