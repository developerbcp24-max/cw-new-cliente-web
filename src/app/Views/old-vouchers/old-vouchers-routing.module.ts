import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OldVouchersForTimeComponent } from './old-vouchers-for-time/old-vouchers-for-time.component';

const routes: Routes = [
  { path: 'oldCurrent', component: OldVouchersForTimeComponent },
  { path: 'oldAMonthAgo', component: OldVouchersForTimeComponent },
  { path: 'oldTwoMonthsAgo', component: OldVouchersForTimeComponent },
  { path: 'oldThreeMonthsAgo', component: OldVouchersForTimeComponent },
  { path: 'oldAYearAgo', component: OldVouchersForTimeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OldVouchersRoutingModule { }
