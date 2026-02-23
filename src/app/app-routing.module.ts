import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Directives/auth.guard';
import { MasterPageComponent } from './Views/admin/master-page/master-page.component';
import { MovementsAndBalancesComponent } from './Views/admin/movements-and-balances/movements-and-balances.component';
import { MovementsListComponent } from './Views/admin/movements-list/movements-list.component';
const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./Views/admin/admin.module').then((m) => m.AdminModule),
    },
    {
        path: '', component: MasterPageComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: MovementsAndBalancesComponent },
            { path: 'movements', component: MovementsListComponent },
            //{ path: 'devs', component: DevsComponent },
            { path: 'transfers', loadChildren: () => import('./Views/transfers/transfers.module').then(x => x.TransfersModule) },
            { path: 'queries', loadChildren: () => import('./Views/queries/queries.module').then(x => x.QueriesModule) },
            { path: 'massPayments', loadChildren: () => import('./Views/mass-payments/mass-payments.module').then(x => x.MassPaymentsModule) },
            { path: 'service-payments', loadChildren: () => import('./Views/service-payments/service-payments.module').then(x => x.ServicePaymentsModule) },
            { path: 'operations', loadChildren: () => import('./Views/operations/operations.module').then(x => x.OperationsModule) },
            { path: 'vouchers', loadChildren: () => import('./Views/vouchers/vouchers.module').then(x => x.VouchersModule) },
            { path: 'old-vouchers', loadChildren: () => import('./Views/old-vouchers/old-vouchers.module').then(x => x.OldVouchersModule) },
            { path: 'credits', loadChildren: () => import('./Views/credits/credits.module').then(x => x.CreditsModule) },
            { path: 'new-service-payments', loadChildren: () => import('./Views/new-service-payments/new-service-payments.module').then(x => x.NewServicePaymentsModule) },
            { path: 'qr-multiplica', loadChildren: () => import('./Views/qr-multiplica/qr-multiplica.module').then(x => x.QrMultiplicaModule) },
            { path: 'fx', loadChildren: () => import('./Views/fx/fx.module').then(x => x.FxModule) },
            //{ path: 'qr-multiplica', loadChildren: () => import('./Views/qr-multiplica/qr-multiplica.module').then(m=>m.QrMultiplicaModule)},
            { path: 'support', component: MovementsAndBalancesComponent },
        ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
