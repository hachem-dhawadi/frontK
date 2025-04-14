import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandeComponent } from './commande/commande.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { ProduitComponent } from './produit/produit.component';
import { ChatbotComponent } from './chat-bot/chat-bot.component';

const routes: Routes = [
  { path: 'commande', component: CommandeComponent },
  { path: 'produit', component: ProduitComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'livraison', component: LivraisonComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
