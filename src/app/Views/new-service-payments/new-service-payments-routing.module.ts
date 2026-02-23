import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPaseServiceComponent } from './new-pase-service/new-pase-service.component';

const routes: Routes = [
  { path: 'new-service', component: NewPaseServiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewServicePaymentsRoutingModule { }
