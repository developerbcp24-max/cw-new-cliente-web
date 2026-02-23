import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { OldVouchersForTimeComponent } from './old-vouchers-for-time/old-vouchers-for-time.component';
import { FilterOldVouchersComponent } from './components/filter-old-vouchers/filter-old-vouchers.component';
import { ListOldVouchersComponent } from './components/list-old-vouchers/list-old-vouchers.component';
import { OldVouchersRoutingModule } from './old-vouchers-routing.module';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    OldVouchersForTimeComponent,
    FilterOldVouchersComponent,
    ListOldVouchersComponent
  ],
  imports: [
    CommonModule,
    OldVouchersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DecimalPipe]
})
export class OldVouchersModule {

  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
}
