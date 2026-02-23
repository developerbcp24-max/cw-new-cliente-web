
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrMultiplicaBcpComponent } from './qr-multiplica-bcp/qr-multiplica-bcp.component';
import { QrReportBcpComponent } from './qr-report-bcp/qr-report-bcp.component';
import { ReporteCopabol } from './qr-report-bcp-copabol/qr-report-bcp.component';
import { AdminQrComponent } from './admin-qr/admin-qr.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';


const routes: Routes = [

  { path: 'qr-multiplica-bcp', component: QrMultiplicaBcpComponent },
  { path: 'qr-report-bcp', component: QrReportBcpComponent },
  { path: 'qr-report-bcp-copabol', component: ReporteCopabol },
  { path: 'qr-admin-bcp', component: AdminQrComponent  },
  { path: 'register-user', component: AdminUsersComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrMultiplicaRoutingModule { }

