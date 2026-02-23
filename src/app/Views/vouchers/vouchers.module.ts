import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckComponent } from './check/check.component';
import { ElectronicBillComponent } from './electronic-bill/electronic-bill.component';
import { NewElectronicBillComponent } from './new-electronic-bill/new-electronic-bill.component';
import { SwiftComponent } from './swift/swift.component';
import { VouchersByBatchComponent } from './vouchers-by-batch/vouchers-by-batch.component';
import { VouchersByOperationComponent } from './vouchers-by-operation/vouchers-by-operation.component';
import { VouchersForTimeComponent } from './vouchers-for-time/vouchers-for-time.component';
import { ElectronicVoucherComponent } from './electronic-voucher/electronic-voucher/electronic-voucher.component';
/* components voucher */
import { RangeDatePickerComponent } from './electronic-voucher/components/range-date-picker/range-date-picker.component';
import { TableElectronicVoucherComponent } from './electronic-voucher/components/table-electronic-voucher/table-electronic-voucher.component';
/* component */
import { FilterTypeTransfersComponent } from './components/filter-type-transfers/filter-type-transfers.component';
import { FilterVoucherOperationComponent } from './components/filter-voucher-operation/filter-voucher-operation.component';
import { ListCheckSentComponent } from './components/list-check-sent/list-check-sent.component';
import { ListSwiftReceivedComponent } from './components/list-swift-received/list-swift-received.component';
import { ListSwiftSentComponent } from './components/list-swift-sent/list-swift-sent.component';
import { ListVoucherOperationComponent } from './components/list-voucher-operation/list-voucher-operation.component';
import { VouchersListComponent } from './components/vouchers-list/vouchers-list.component';
import { VouchersRoutingModule } from './vouchers-routing.module';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppMaterialModule } from '../angular.material/app.material.module';



@NgModule({
  declarations: [
    CheckComponent,
    ElectronicBillComponent,
    NewElectronicBillComponent,
    SwiftComponent,
    VouchersByBatchComponent,
    VouchersByOperationComponent,
    VouchersForTimeComponent,
    ElectronicVoucherComponent,
    RangeDatePickerComponent,
    TableElectronicVoucherComponent,
    FilterTypeTransfersComponent,
    FilterVoucherOperationComponent,
    ListCheckSentComponent,
    ListSwiftReceivedComponent,
    ListSwiftSentComponent,
    ListVoucherOperationComponent,
    VouchersListComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,
    AppMaterialModule,
  ],
  exports: [
    VouchersListComponent,
    FilterVoucherOperationComponent,
    MatDatepickerModule,
    AppMaterialModule,
  ]
})
export class VouchersModule {

  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
}
