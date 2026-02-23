import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PurchaseComponent} from "./purchase/purchase.component";
import {SalesComponent} from "./sales/sales.component";

const routes: Routes = [
  {
    path: 'purchase',
    component: PurchaseComponent
  },
  {
    path: 'sales',
    component: SalesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxRoutingModule {
}
