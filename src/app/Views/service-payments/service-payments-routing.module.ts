import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicePaymentComponent } from './service-payment/service-payment.component';
import { RuatComponent } from './ruat/ruat.component';
import { AfpComponent } from './afp/afp.component';
import { WaterComponent } from './water/water.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ServiceTelephonyComponent } from './service-telephony/service-telephony.component';
import { ComunicationComponent } from './comunication/comunication.component';
import { YpfbComponent } from './ypfb/ypfb.component';

const routes: Routes = [
  { path: 'service-payments', component: ServicePaymentComponent },
  { path: 'ruat', component: RuatComponent },
  { path: 'afp', component: AfpComponent },
  { path: 'water', component: WaterComponent },
  { path: 'electricity', component: ElectricityComponent },
  { path: 'telephony', component: ServiceTelephonyComponent },
  { path: 'comunication', component: ComunicationComponent },
  { path: 'ypfb', component: YpfbComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicePaymentsRoutingModule { }
