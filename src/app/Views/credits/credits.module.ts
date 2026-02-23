import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotaPaymentDetailComponent } from './components/quota-payment-detail/quota-payment-detail.component';
import { DisbursementVouchersComponent } from './disbursement-vouchers/disbursement-vouchers.component';
import { PaymentPlansComponent } from './payment-plans/payment-plans.component';
import { QuotaPaymentComponent } from './quota-payment/quota-payment.component';
import { QuotaVouchersComponent } from './quota-vouchers/quota-vouchers.component';
import { CreditsRoutingModule } from './credits-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../Directives/directives.module';
import { SharedModule } from '../shared/shared.module';
/* import { DirectivesModule } from 'src/app/Directives/directives.module';
import { SharedModule } from "../shared/SharedModule" */;



@NgModule({
  declarations: [
    QuotaPaymentDetailComponent,
    DisbursementVouchersComponent,
    PaymentPlansComponent,
    QuotaPaymentComponent,
    QuotaVouchersComponent
  ],
  exports: [
    QuotaPaymentDetailComponent,
    DisbursementVouchersComponent,
    PaymentPlansComponent,
    QuotaPaymentComponent,
    QuotaVouchersComponent
  ],
  imports: [
    CommonModule,
    CreditsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    SharedModule,
  ]
})
export class CreditsModule {
/*
  constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
 }
