import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/* import {FxRoutingModule} from './fx-routing.module';
import {SalesComponent} from './sales/sales.component';
import {PurchaseComponent} from './purchase/purchase.component'; */
//import {SharedModule} from "../shared/SharedModule";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { SharedModule } from '../shared/shared.module';
import { SalesComponent } from './sales/sales.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { FxRoutingModule } from './fx-routing.module';


@NgModule({
  declarations: [
    SalesComponent,
    PurchaseComponent
  ],
  imports: [
    CommonModule,
    FxRoutingModule,
    SharedModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule
  ]
})
export class FxModule {
/*
  constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
}
