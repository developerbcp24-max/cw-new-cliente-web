import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotaPaymentComponent } from './quota-payment/quota-payment.component';
import { QuotaVouchersComponent } from './quota-vouchers/quota-vouchers.component';
import { DisbursementVouchersComponent } from './disbursement-vouchers/disbursement-vouchers.component';
import { PaymentPlansComponent } from './payment-plans/payment-plans.component';

const routes: Routes = [
  { path: 'quota-payment', component: QuotaPaymentComponent },
  { path: 'quota-vouchers', component: QuotaVouchersComponent },
  { path: 'disbursement-vouchers', component: DisbursementVouchersComponent },
  { path: 'payment-plans', component: PaymentPlansComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditsRoutingModule { }
