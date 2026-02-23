import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CashPaymentsComponent } from './cash-payments/cash-payments.component';
import { CashPaymentsInLineComponent } from './cash-payments-in-line/cash-payments-in-line.component';
import { FavoritePaymentsComponent } from './favorite-payments/favorite-payments.component';
import { MultiplePaymentsComponent } from './multiple-payments/multiple-payments.component';
import { PaymentBankAchComponent } from './payment-bank-ach/payment-bank-ach.component';
import { PaymentDebitOrdersAchComponent } from './payment-debit-orders-ach/payment-debit-orders-ach.component';
import { ProvidersAccountDepositComponent } from './providers-account-deposit/providers-account-deposit.component';
import { ProvidersCheckManagementComponent } from './providers-check-management/providers-check-management.component';
import { ProvidersDepositInOtherBankCheckComponent } from './providers-deposit-in-other-bank-check/providers-deposit-in-other-bank-check.component';
import { SalariesPaymentsComponent } from './salaries-payments/salaries-payments.component';
import { SoliPaymentsComponent } from './soli-payments/soli-payments.component';
import { TaxPaymentCheckManagementComponent } from './tax-payment-check-management/tax-payment-check-management.component';
/* components */
import { AccountDepositSpreadsheetComponent } from './components/account-deposit-spreadsheet/account-deposit-spreadsheet.component';
import { AchOddSpreadsheetComponent } from './components/ach-odd-spreadsheet/ach-odd-spreadsheet.component';
import { AchSpreadsheetComponent } from './components/ach-spreadsheet/ach-spreadsheet.component';
import { AmountAccountVerificatedComponent } from './components/amount-account-verificated/amount-account-verificated.component';
import { CashInLineSpreadsheetComponent } from './components/cash-in-line-spreadsheet/cash-in-line-spreadsheet.component';
import { CashSpreadsheetComponent } from './components/cash-spreadsheet/cash-spreadsheet.component';
import { CheckManagementSpreadsheetComponent } from './components/check-management-spreadsheet/check-management-spreadsheet.component';
import { DepositOtherBankCheckSpreadsheetComponent } from './components/deposit-other-bank-check-spreadsheet/deposit-other-bank-check-spreadsheet.component';
import { FavAchComponent } from './components/favorite-spreadsheets/fav-ach/fav-ach.component';
import { FavCashComponent } from './components/favorite-spreadsheets/fav-cash/fav-cash.component';
import { FavProvidersComponent } from './components/favorite-spreadsheets/fav-providers/fav-providers.component';
import { FavSalariesComponent } from './components/favorite-spreadsheets/fav-salaries/fav-salaries.component';
import { FavoriteTransactionsComponent } from './components/favorite-transactions/favorite-transactions.component';
import { HeaderDetailComponent } from './components/header-detail/header-detail.component';
import { ImportFilesComponent } from './components/import-files/import-files.component';
import { LoadPreviousFormComponent } from './components/load-previous-form/load-previous-form.component';
import { SalariesSpreadsheetComponent } from './components/salaries-spreadsheet/salaries-spreadsheet.component';
import { SoliSpreadsheetComponent } from './components/soli-spreadsheet/soli-spreadsheet.component';
import { TaxCheckSpreadsheetComponent } from './components/tax-check-spreadsheet/tax-check-spreadsheet.component';
import { AchComponent } from './components/multiple-spreadsheets/ach/ach.component';
import { CashComponent } from './components/multiple-spreadsheets/cash/cash.component';
import { ProvidersComponent } from './components/multiple-spreadsheets/providers/providers.component';
import { SalariesComponent } from './components/multiple-spreadsheets/salaries/salaries.component';
import { MassPaymentsRoutingModule } from './mass-payments-routing.module';
import { FormsModule } from '@angular/forms';
/* import { SharedModule } from "../shared/SharedModule";
import { DirectivesModule } from 'src/app/Directives/directives.module'; */
import { ProvidersCheckManagementLipComponent } from './providers-check-management-lip/providers-check-management-lip.component';
import { SharedModule } from '../shared/shared.module';
import { DirectivesModule } from '../../Directives/directives.module';



@NgModule({
  declarations: [
    CashPaymentsComponent,
    CashPaymentsInLineComponent,
    FavoritePaymentsComponent,
    MultiplePaymentsComponent,
    PaymentBankAchComponent,
    PaymentDebitOrdersAchComponent,
    ProvidersAccountDepositComponent,
    ProvidersCheckManagementComponent,
    ProvidersDepositInOtherBankCheckComponent,
    SalariesPaymentsComponent,
    SoliPaymentsComponent,
    TaxPaymentCheckManagementComponent,
    AccountDepositSpreadsheetComponent,
    AchOddSpreadsheetComponent,
    AchSpreadsheetComponent,
    ImportFilesComponent,
    AmountAccountVerificatedComponent,
    CashInLineSpreadsheetComponent,
    CashSpreadsheetComponent,
    CheckManagementSpreadsheetComponent,
    DepositOtherBankCheckSpreadsheetComponent,
    FavAchComponent,
    FavCashComponent,
    FavProvidersComponent,
    FavSalariesComponent,
    FavoriteTransactionsComponent,
    HeaderDetailComponent,

    LoadPreviousFormComponent,
    SalariesSpreadsheetComponent,
    SoliSpreadsheetComponent,
    TaxCheckSpreadsheetComponent,
    AchComponent,
    CashComponent,
    ProvidersComponent,
    SalariesComponent,
    ProvidersCheckManagementLipComponent
  ],
  imports: [
    CommonModule,
    MassPaymentsRoutingModule,
    FormsModule,
    SharedModule,
    DirectivesModule,
    //NgModule
  ],
  exports: [
    ImportFilesComponent,
    LoadPreviousFormComponent,
    AmountAccountVerificatedComponent
  ],
  providers: [DecimalPipe]
})
export class MassPaymentsModule {

  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
}
