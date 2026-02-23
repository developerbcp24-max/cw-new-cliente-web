import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { QrMultiplicaBcpComponent } from './qr-multiplica-bcp/qr-multiplica-bcp.component';
import { QrMultiplicaRoutingModule } from './qr-multiplica-routing.module';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrReportBcpComponent } from './qr-report-bcp/qr-report-bcp.component';
import { ReporteCopabol } from './qr-report-bcp-copabol/qr-report-bcp.component';
import { QrListBcpComponent } from './components/qr-list-bcp/qr-list-bcp.component';
import { QrSearchBcpComponent } from './components/qr-search-bcp/qr-search-bcp.component';
import { AdminQrComponent } from './admin-qr/admin-qr.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminUsersCreateComponent } from './components/admin-users-create/admin-users-create.component';
import { ListUsersComponent } from './components/components/list-users/list-users.component';
import { ListAtmComponent } from './components/components/list-atm/list-atm.component';
import { AdminSucursalComponent } from './components/admin-sucursal/admin-sucursal.component';
import { AdminCajaComponent } from './components/admin-caja/admin-caja.component';
import { ListBranchComponent } from './components/components/list-branch/list-branch.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    QrMultiplicaBcpComponent,
    QrReportBcpComponent,
    ReporteCopabol,
    QrListBcpComponent,
    QrSearchBcpComponent,
    AdminQrComponent,
    AdminUsersComponent,
    AdminUsersCreateComponent,
    ListUsersComponent,
    ListAtmComponent,
    AdminSucursalComponent,
    AdminCajaComponent,
    ListBranchComponent
  ],
  exports:[
    AdminUsersCreateComponent
  ],
  imports: [
    CommonModule,
    QrMultiplicaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [DecimalPipe]
})
export class QrMultiplicaModule {

  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
 }
