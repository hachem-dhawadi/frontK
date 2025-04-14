import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8081/Commande';

  constructor(private http: HttpClient) {}

  getAllCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Allcommande`);
  }

  getCommandeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getcommande/${id}`);
  }

  addCommande(commande: any): Observable<any> {
    if (!commande.orderdate) {
      commande.orderdate = new Date().toISOString().split('T')[0];
    }
    return this.http.post<any>(`${this.apiUrl}/addcommande`, commande);
  }

  updateCommande(commande: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifycommande`, commande);
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removecommande/${id}`);
  }
}
