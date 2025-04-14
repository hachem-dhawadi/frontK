import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private baseUrl = 'http://localhost:8081/Livraison';

  constructor(private http: HttpClient) {}

  // Get all livraisons
  getAllLivraisons(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/AllLivraison`);
  }

  // Get a livraison by ID
  getLivraisonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getlivraison/${id}`);
  }

  // Add a new livraison
  addLivraison(livraison: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addlivraison`, livraison);
  }

  // Modify an existing livraison
  modifyLivraison(livraison: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modifylivraison`, livraison);
  }

  // Delete a livraison
  deleteLivraison(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/removelivraison/${id}`);
  }

  // Get all commandes (assuming this is needed for your select dropdown)
  getAllCommandes(): Observable<any> {
    return this.http.get<any>('http://localhost:8081/Commande/Allcommande'); // Make sure this URL is correct
  }
}
