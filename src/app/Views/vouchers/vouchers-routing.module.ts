import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwiftComponent } from './swift/swift.component';
import { ElectronicVoucherComponent } from './electronic-voucher/electronic-voucher/electronic-voucher.component';
import { CheckComponent } from './check/check.component';
import { ElectronicBillComponent } from './electronic-bill/electronic-bill.component';
import { VouchersByOperationComponent } from './vouchers-by-operation/vouchers-by-operation.component';
import { VouchersForTimeComponent } from './vouchers-for-time/vouchers-for-time.component';
import { NewElectronicBillComponent } from './new-electronic-bill/new-electronic-bill.component';
import { VouchersByBatchComponent } from './vouchers-by-batch/vouchers-by-batch.component';

const routes: Routes = [
  { path: 'swift', component: SwiftComponent },
  { path: 'voucherElectronic', component: ElectronicVoucherComponent },
  { path: 'current', component: VouchersForTimeComponent },
  { path: 'aMonthAgo', component: VouchersForTimeComponent },
  { path: 'twoMonthsAgo', component: VouchersForTimeComponent },
  { path: 'threeMonthsAgo', component: VouchersForTimeComponent },
  { path: 'aYearAgo', component: VouchersForTimeComponent },
  { path: 'check', component: CheckComponent },
  { path: 'electronicBill', component: ElectronicBillComponent },
  { path: 'vouchersByOperation', component: VouchersByOperationComponent },
  { path: 'vouchersByBatch', component: VouchersByBatchComponent },
  { path: 'newElectronicBill', component: NewElectronicBillComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
