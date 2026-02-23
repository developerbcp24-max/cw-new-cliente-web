import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashPaymentsComponent } from './cash-payments/cash-payments.component';
import { MultiplePaymentsComponent } from './multiple-payments/multiple-payments.component';
import { FavoritePaymentsComponent } from './favorite-payments/favorite-payments.component';
import { SalariesPaymentsComponent } from './salaries-payments/salaries-payments.component';
import { ProvidersCheckManagementComponent } from './providers-check-management/providers-check-management.component';
import { ProvidersDepositInOtherBankCheckComponent} from './providers-deposit-in-other-bank-check/providers-deposit-in-other-bank-check.component';
import { TaxPaymentCheckManagementComponent } from './tax-payment-check-management/tax-payment-check-management.component';
import { PaymentBankAchComponent } from './payment-bank-ach/payment-bank-ach.component';
import { PaymentDebitOrdersAchComponent } from './payment-debit-orders-ach/payment-debit-orders-ach.component';
import { ProvidersAccountDepositComponent } from './providers-account-deposit/providers-account-deposit.component';
import { CashPaymentsInLineComponent } from './cash-payments-in-line/cash-payments-in-line.component';
import { SoliPaymentsComponent } from './soli-payments/soli-payments.component';
import { ProvidersCheckManagementLipComponent } from './providers-check-management-lip/providers-check-management-lip.component';

const routes: Routes = [
  { path: 'cashPayments', component: CashPaymentsComponent },
  { path: 'cashInLinePayments', component: CashPaymentsInLineComponent },
  { path: 'multiplePayments', component: MultiplePaymentsComponent},
  { path: 'favoritePayments', component: FavoritePaymentsComponent},
  { path: 'salariesPayments', component: SalariesPaymentsComponent},
  { path: 'providersCheckManagement', component: ProvidersCheckManagementComponent},
  { path: 'providersCheckManagementLip', component: ProvidersCheckManagementLipComponent},
  { path: 'providersDepositInOtherBankCheck', component: ProvidersDepositInOtherBankCheckComponent},
  { path: 'taxPaymentCheckManagement', component: TaxPaymentCheckManagementComponent },
  { path: 'providersAccountDeposit', component: ProvidersAccountDepositComponent},
  { path: 'paymentsACH', component: PaymentBankAchComponent },
  { path: 'paymentsOddACH', component: PaymentDebitOrdersAchComponent },
  { path: 'soliPayments', component: SoliPaymentsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MassPaymentsRoutingModule { }
