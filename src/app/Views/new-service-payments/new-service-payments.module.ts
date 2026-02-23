import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NewPaseServiceComponent } from './new-pase-service/new-pase-service.component';
import { AddDebtComponent } from './components/add-debt/add-debt.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { SendBillDataComponent } from './components/send-bill-data/send-bill-data.component';
import { NewServicePaymentsRoutingModule } from './new-service-payments-routing.module';
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../angular.material/app.material.module';


@NgModule({
  declarations: [
    NewPaseServiceComponent,
    AddDebtComponent,
    InvoiceDetailComponent,
    SendBillDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NewServicePaymentsRoutingModule,
    SharedModule,
    AppMaterialModule
  ],
  exports: [
    NewPaseServiceComponent,
    AddDebtComponent,
    InvoiceDetailComponent,
    SendBillDataComponent
  ],
  providers: [DecimalPipe]
})
export class NewServicePaymentsModule {

  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
}
