import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NationalComponent } from './national/national.component';
import { TransferAbroadConfirmComponent } from './transfer-abroad-confirm/transfer-abroad-confirm.component';
import { TransferAbroadDetailComponent } from './transfer-abroad-detail/transfer-abroad-detail.component';
import { TransferAbroadComponent } from './transfer-abroad/transfer-abroad.component';

const routes: Routes = [
  { path: 'national', component: NationalComponent },
  { path: 'transfer-abroad', component: TransferAbroadComponent },
  { path: 'transfer-abroad-confirm', component: TransferAbroadConfirmComponent },
  { path: 'transfer-abroad-detail', component: TransferAbroadDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfersRoutingModule { }
