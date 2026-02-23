import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoDisbursementComponent } from './auto-disbursement/auto-disbursement.component';
import { BallotOfWarrantyComponent } from './ballot-of-warranty/ballot-of-warranty.component';
import { ClaimRequestComponent } from './claim-request/claim-request.component';
import { FavoritePaymentsSettingsComponent } from './favorite-payments-settings/favorite-payments-settings.component';
import { ModificationRequestComponent } from './modification-request/modification-request.component';
import { NewBallotOfWarrantyComponent } from './new-ballot-of-warranty/new-ballot-of-warranty.component';

const routes: Routes = [
  { path: 'modification-request', component: ModificationRequestComponent },
  { path: 'favoritePaymentsSettings', component: FavoritePaymentsSettingsComponent},
  { path: 'claimRequest', component: ClaimRequestComponent },
  { path: 'ballotOfWarranty', component: BallotOfWarrantyComponent},
  { path: 'newBallotOfWarranty', component: NewBallotOfWarrantyComponent},
  { path: 'autoDisbursement', component: AutoDisbursementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
