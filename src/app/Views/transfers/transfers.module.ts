import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NationalComponent } from './national/national.component';
import { TransferAbroadComponent } from './transfer-abroad/transfer-abroad.component';
import { TransferAbroadConfirmComponent } from './transfer-abroad-confirm/transfer-abroad-confirm.component';
import { TransferAbroadDetailComponent } from './transfer-abroad-detail/transfer-abroad-detail.component';
import { TransferAbroadStep1Component } from './transfer-abroad-step1/transfer-abroad-step1.component';
import { TransferAbroadStep2Component } from './transfer-abroad-step2/transfer-abroad-step2.component';
import { TransferAbroadStep3Component } from './transfer-abroad-step3/transfer-abroad-step3.component';
import { CurrencyAmountAbroadComponent } from './components/currency-amount-abroad/currency-amount-abroad.component';
import { DetailAuthorizersComponent } from './components/detail-authorizers/detail-authorizers.component';
import { DetailChangeDataComponent } from './components/detail-change-data/detail-change-data.component';
import { DetailDestinyAccountComponent } from './components/detail-destiny-account/detail-destiny-account.component';
import { FavoriteTransfersComponent } from './components/favorite-transfers/favorite-transfers.component';
import { FrecuentTransferAbroadAddComponent } from './components/frecuent-transfer-abroad-add/frecuent-transfer-abroad-add.component';
import { FrecuentTransfersAbroadComponent } from './components/frecuent-transfers-abroad/frecuent-transfers-abroad.component';
import { FundsDeclarationAbroadComponent } from './components/funds-declaration-abroad/funds-declaration-abroad.component';
import { InterbankAccountsComponent } from './components/interbank-accounts/interbank-accounts.component';
import { SearchAccountsComponent } from './components/search-accounts/search-accounts.component';
import { TermsTransfersAbroadComponent } from './components/terms-transfers-abroad/terms-transfers-abroad.component';
import { TicketComissionComponent } from './components/ticket-comission/ticket-comission.component';
import { TicketOtherCurrencyComponent } from './components/ticket-other-currency/ticket-other-currency.component';
import { TransfersRoutingModule } from './transfers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { DirectivesModule } from '../../Directives/directives.module';
import { LoadPreviousFormComponent } from '../mass-payments/components/load-previous-form/load-previous-form.component';



@NgModule({
  declarations: [
    NationalComponent,
    TransferAbroadComponent,
    TransferAbroadConfirmComponent,
    TransferAbroadDetailComponent,
    TransferAbroadStep1Component,
    TransferAbroadStep2Component,
    TransferAbroadStep3Component,
    CurrencyAmountAbroadComponent,
    DetailAuthorizersComponent,
    DetailChangeDataComponent,
    DetailDestinyAccountComponent,
    FavoriteTransfersComponent,
    FrecuentTransferAbroadAddComponent,
    FrecuentTransfersAbroadComponent,
    FundsDeclarationAbroadComponent,
    InterbankAccountsComponent,
    SearchAccountsComponent,
    TermsTransfersAbroadComponent,
    TicketComissionComponent,
    TicketOtherCurrencyComponent
  ],
  imports: [
    CommonModule,
    TransfersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule
  ]
})
export class TransfersModule {
  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
 }
