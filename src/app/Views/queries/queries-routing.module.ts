import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditCardsComponent } from './credit-cards/credit-cards.component';
import { CreditCardsMovementsComponent } from './credit-cards-movements/credit-cards-movements.component';
import { HistoricalAccountsComponent } from './historical-accounts/historical-accounts.component';
import { IdentificationDepositsComponent } from './identification-deposits/identification-deposits.component';
import { PaseComponent } from './pase/pase.component';
import { DetailPaseComponent } from './detail-pase/detail-pase.component';
import { PendingsComponent } from './pendings/pendings.component';
import { BatchDetailComponent } from './components/batch-detail/batch-detail.component';
import { BatchStatusComponent } from './components/batch-status/batch-status.component';
import { TrackingComponent } from './tracking/tracking.component';
import { ApiInfoEnrquecidaComponent } from './api-info-enrquecida/api-info-enrquecida.component';


const routes: Routes = [
  { path: 'creditCards', component: CreditCardsComponent },
  { path: 'creditCardsMovements', component: CreditCardsMovementsComponent },
  { path: 'HistoricalAccounts', component: HistoricalAccountsComponent },
  { path: 'api-info-enrquecida', component: ApiInfoEnrquecidaComponent },
  { path: 'identification-deposits', component: IdentificationDepositsComponent },
  { path: '', redirectTo: 'detail-pase', pathMatch: 'full' },
  { path: 'pase', component: PaseComponent },
  { path: 'detail-pase', component: DetailPaseComponent },
  { path: 'pendings', component: PendingsComponent },
  { path: 'batch-detail', component: BatchDetailComponent },
  { path: 'batch-status', component: BatchStatusComponent },
  { path: 'tracking', component: TrackingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueriesRoutingModule { }
