import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CreditCardsComponent } from './credit-cards/credit-cards.component';
import { CreditCardsMovementsComponent } from './credit-cards-movements/credit-cards-movements.component';
import { DetailPaseComponent } from './detail-pase/detail-pase.component';
import { HistoricalAccountsComponent } from './historical-accounts/historical-accounts.component';
import { IdentificationDepositsComponent } from './identification-deposits/identification-deposits.component';
import { PaseComponent } from './pase/pase.component';
import { PendingsComponent } from './pendings/pendings.component';
import { TrackingComponent } from './tracking/tracking.component';
/* components */
import { AuthorizerStatusComponent } from './components/authorizer-status/authorizer-status.component';
import { BallotOfWarrantyDetailComponent } from './components/ballot-of-warranty-detail/ballot-of-warranty-detail.component';
import { BatchDetailComponent } from './components/batch-detail/batch-detail.component';
import { BatchStatusComponent } from './components/batch-status/batch-status.component';
import { CashPaymentDetailComponent } from './components/cash-payment-detail/cash-payment-detail.component';
import { CashPaymentInLineDetailComponent } from './components/cash-payment-in-line-detail/cash-payment-in-line-detail.component';
import { ClaimRequestDetailComponent } from './components/claim-request-detail/claim-request-detail.component';
import { ConfigurationFavoritePaymentDetailComponent } from './components/configuration-favorite-payment-detail/configuration-favorite-payment-detail.component';
import { FavoritePaymentsDetailComponent } from './components/favorite-payments-detail/favorite-payments-detail.component';
import { FilterPaseComponent } from './components/filter-pase/filter-pase.component';
import { GenerateEndComponent } from './components/generate-end/generate-end.component';
import { GenerateHeadComponent } from './components/generate-head/generate-head.component';
import { HistoricalAccountDetailComponent } from './components/historical-account-detail/historical-account-detail.component';
import { HistoricalAccountListComponent } from './components/historical-account-list/historical-account-list.component';
import { ListPaseComponent } from './components/list-pase/list-pase.component';
import { ModificationRequestDetailComponent } from './components/modification-request-detail/modification-request-detail.component';
import { MultiplePaymentsDetailComponent } from './components/multiple-payments-detail/multiple-payments-detail.component';
import { NewBallotOfWarrantyDetailComponent } from './components/new-ballot-of-warranty-detail/new-ballot-of-warranty-detail.component';
import { NewPasePaymentDetailComponent } from './components/new-pase-payment-detail/new-pase-payment-detail.component';
import { PaymentAchOddDetailComponent } from './components/payment-ach-odd-detail/payment-ach-odd-detail.component';
import { PaymentAfpDetailComponent } from './components/payment-afp-detail/payment-afp-detail.component';
import { PaymentBankAchDetailComponent } from './components/payment-bank-ach-detail/payment-bank-ach-detail.component';
import { PaymentElfecDetailComponent } from './components/payment-elfec-detail/payment-elfec-detail.component';
import { PaymentTaxCheckDetailComponent } from './components/payment-tax-check-detail/payment-tax-check-detail.component';
import { PendingBatchListComponent } from './components/pending-batch-list/pending-batch-list.component';
import { ProvidersCheckManagementDetailComponent } from './components/providers-check-management-detail/providers-check-management-detail.component';
import { ProvidersDepositOtherBankChecksDetailComponent } from './components/providers-deposit-other-bank-checks-detail/providers-deposit-other-bank-checks-detail.component';
import { ProvidersPaymentDetailComponent } from './components/providers-payment-detail/providers-payment-detail.component';
import { QuotaPaymentDetailComponent } from './components/quota-payment-detail/quota-payment-detail.component';
import { SalariesPaymentsDetailComponent } from './components/salaries-payments-detail/salaries-payments-detail.component';
import { SearchCreditCardsComponent } from './components/search-credit-cards/search-credit-cards.component';
import { SearchCreditCardsMovementsPerMonthComponent } from './components/search-credit-cards-movements-per-month/search-credit-cards-movements-per-month.component';
import { ServicePasePaymentDetailComponent } from './components/service-pase-payment-detail/service-pase-payment-detail.component';
import { ServicePaymentBatchDetailComponent } from './components/service-payment-batch-detail/service-payment-batch-detail.component';
import { SoliPaymentDetailComponent } from './components/soli-payment-detail/soli-payment-detail.component';
import { TelephonyPaymentsDetailComponent } from './components/telephony-payments-detail/telephony-payments-detail.component';
import { TrackingListComponent } from './components/tracking-list/tracking-list.component';
import { TransferAbroadBatchDetailComponent } from './components/transfer-abroad-batch-detail/transfer-abroad-batch-detail.component';
import { TransferAbroadFormBatchDetailComponent } from './components/transfer-abroad-form-batch-detail/transfer-abroad-form-batch-detail.component';
import { TransferBatchDetailComponent } from './components/transfer-batch-detail/transfer-batch-detail.component';
import { QueriesRoutingModule } from './queries-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppMaterialModule } from '../angular.material/app.material.module';
import { ApiInfoEnrquecidaComponent } from './api-info-enrquecida/api-info-enrquecida.component';
import { ApiInfoListComponent } from './components/api-info-list/api-info-list.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { DetaildComponent } from './fx/detaild/detaild.component';
import { QrPaymentAchBatchDetailComponent } from './components/qr-payment-ach-batch-detail/qr-payment-ach-batch-detail.component';


@NgModule({
  declarations: [
    CreditCardsComponent,
    CreditCardsMovementsComponent,
    DetailPaseComponent,
    HistoricalAccountsComponent,
    IdentificationDepositsComponent,
    PaseComponent,
    PendingsComponent,
    TrackingComponent,
    AuthorizerStatusComponent,
    BallotOfWarrantyDetailComponent,
    BatchDetailComponent,
    BatchStatusComponent,
    CashPaymentDetailComponent,
    CashPaymentInLineDetailComponent,
    ClaimRequestDetailComponent,
    ConfigurationFavoritePaymentDetailComponent,
    FavoritePaymentsDetailComponent,
    FilterPaseComponent,
    GenerateEndComponent,
    GenerateHeadComponent,
    HistoricalAccountDetailComponent,
    HistoricalAccountListComponent,
    ListPaseComponent,
    ModificationRequestDetailComponent,
    MultiplePaymentsDetailComponent,
    NewBallotOfWarrantyDetailComponent,
    NewPasePaymentDetailComponent,
    PaymentAchOddDetailComponent,
    PaymentAfpDetailComponent,
    PaymentBankAchDetailComponent,
    PaymentElfecDetailComponent,
    PaymentTaxCheckDetailComponent,
    PendingBatchListComponent,
    ProvidersCheckManagementDetailComponent,
    ProvidersDepositOtherBankChecksDetailComponent,
    ProvidersPaymentDetailComponent,
    QuotaPaymentDetailComponent,
    SalariesPaymentsDetailComponent,
    SearchCreditCardsComponent,
    SearchCreditCardsMovementsPerMonthComponent,
    ServicePasePaymentDetailComponent,
    ServicePaymentBatchDetailComponent,
    SoliPaymentDetailComponent,
    TelephonyPaymentsDetailComponent,
    TrackingListComponent,
    TransferAbroadBatchDetailComponent,
    TransferAbroadFormBatchDetailComponent,
    TransferBatchDetailComponent,
    ApiInfoEnrquecidaComponent,
    ApiInfoListComponent,
    InfoDialogComponent,
    DetaildComponent,
    QrPaymentAchBatchDetailComponent,
  ],
  imports: [
    CommonModule,
    QueriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
    AppMaterialModule
  ],
  providers: [DecimalPipe]
})
export class QueriesModule {

  constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  }
 }
