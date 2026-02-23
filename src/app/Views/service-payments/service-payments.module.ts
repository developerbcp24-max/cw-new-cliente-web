import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfpComponent } from './afp/afp.component';
import { ComunicationComponent } from './comunication/comunication.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { RuatComponent } from './ruat/ruat.component';
import { ServicePaymentComponent } from './service-payment/service-payment.component';
import { ServiceTelephonyComponent } from './service-telephony/service-telephony.component';
import { WaterComponent } from './water/water.component';
import { YpfbComponent } from './ypfb/ypfb.component';
/* Components */
import { AddPaymentModalComponent } from './components/add-payment-modal/add-payment-modal.component';
import { AfpDebtDetailComponent } from './components/afp-debt-detail/afp-debt-detail.component';
import { AfpRequestFormComponent } from './components/afp-request-form/afp-request-form.component';
import { ClientCodeComponent } from './components/client-code/client-code.component';
import { DebtDetailComponent } from './components/debt-detail/debt-detail.component';
import { DebtDetailComunicationComponent } from './components/debt-detail-comunication/debt-detail-comunication.component';
import { DebtElfecComponent } from './components/debt-elfec/debt-elfec.component';
import { FavoritePaymentModalComponent } from './components/favorite-payment-modal/favorite-payment-modal.component';
import { InvoiceCodeComponent } from './components/invoice-code/invoice-code.component';
import { PaymentTypeComponent } from './components/payment-type/payment-type.component';
import { PropertyDebtComponent } from './components/property-debt/property-debt.component';
import { SendBillComponent } from './components/send-bill/send-bill.component';
import { TelephonyComponent } from './components/telephony/telephony.component';
import { VehicleDebtComponent } from './components/vehicle-debt/vehicle-debt.component';
import { ServicePaymentsRoutingModule } from './service-payments-routing.module';
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AfpComponent,
    ComunicationComponent,
    ElectricityComponent,
    RuatComponent,
    ServicePaymentComponent,
    ServiceTelephonyComponent,
    WaterComponent,
    YpfbComponent,
    AddPaymentModalComponent,
    AfpDebtDetailComponent,
    AfpRequestFormComponent,
    ClientCodeComponent,
    DebtDetailComponent,
    DebtDetailComunicationComponent,
    DebtElfecComponent,
    FavoritePaymentModalComponent,
    InvoiceCodeComponent,
    PaymentTypeComponent,
    PropertyDebtComponent,
    SendBillComponent,
    TelephonyComponent,
    VehicleDebtComponent
  ],
  imports: [
    CommonModule,
    ServicePaymentsRoutingModule,
    SharedModule,
    FormsModule
  ],
  exports:[
    SendBillComponent
  ]
})
export class ServicePaymentsModule {

 /*  constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
 }
