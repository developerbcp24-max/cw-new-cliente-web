import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import { ApproversAndControllersComponent } from './cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { ApproversAndControllersDetailComponent } from './cw-components/approvers-and-controllers-detail/approvers-and-controllers-detail.component';
import { ApproversAndControllersListComponent } from './cw-components/approvers-and-controllers-list/approvers-and-controllers-list.component';
import { BanksSearcherComponent } from './cw-components/banks-searcher/banks-searcher.component';
import { BarRouteComponent } from './cw-components/bar-route/bar-route.component';
import { ButtonGroupComponent } from './cw-components/button-group/button-group.component';
import { ButtonGroupContentComponent } from './cw-components/button-group-content/button-group-content.component';
import { CompanyLimitsComponent } from './cw-components/company-limits/company-limits.component';
import { CurrencyAndAmountComponent } from './cw-components/currency-and-amount/currency-and-amount.component';
import { CurrencyFlagComponent } from './cw-components/currency-flag/currency-flag.component';
import { DateFutureComponent } from './cw-components/date-future/date-future.component';
import { DateRangeComponent } from './cw-components/date-range/date-range.component';
import { EmailsInputComponent } from './cw-components/emails-input/emails-input.component';
import { FundsModalComponent } from './cw-components/funds-modal/funds-modal.component';
import { InformationPanelComponent } from './cw-components/information-panel/information-panel.component';
import { IntermediaryBankFormAbroadComponent } from './cw-components/intermediary-bank-form-abroad/intermediary-bank-form-abroad.component';
import { ListOfMonthsComponent } from './cw-components/list-of-months/list-of-months.component';
import { ModalComponent } from './cw-components/modal/modal.component';
import { ModalIsBlockComponent } from './cw-components/modal-is-block/modal-is-block.component';
import { MyAccountsComponent } from './cw-components/my-accounts/my-accounts.component';
import { NumberPadComponent } from './cw-components/number-pad/number-pad.component';
import { PaginationComponent } from './cw-components/pagination/pagination.component';
import { PasswordValidationComponent } from './cw-components/password-validation/password-validation.component';
import { PrePreparerModalComponent } from './cw-components/pre-preparer-modal/pre-preparer-modal.component';
import { RequesterFormAbroadComponent } from './cw-components/requester-form-abroad/requester-form-abroad.component';
import { SelectMonthComponent } from './cw-components/select-month/select-month.component';
import { ShowErrorsComponent } from './cw-components/show-errors/show-errors.component';
import { SourceAccountsComponent } from './cw-components/source-accounts/source-accounts.component';
import { StepComponent } from './cw-components/step/step.component';
import { StepperComponent } from './cw-components/stepper/stepper.component';
import { StepperDetailComponent } from './cw-components/stepper-detail/stepper-detail.component';
import { SuccessfulOperationModalComponent } from './cw-components/successful-operation-modal/successful-operation-modal.component';
import { TicketComponent } from './cw-components/ticket/ticket.component';
import { TokenComponent } from './cw-components/token/token.component';
import { TokenModalComponent } from './cw-components/token-modal/token-modal.component';
import { TransferCategoriesAsfiComponent } from './cw-components/transfer-categories-asfi/transfer-categories-asfi.component';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { CompanyNameComponent } from './components/company-name/company-name.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { DirectivesModule } from 'src/app/Directives/directives.module';

//import { AppComponent } from 'src/app/app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppMaterialModule } from '../angular.material/app.material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { DepecratedPaginationComponent } from './components/depecrated-pagination/depecrated-pagination.component';
import { DepecratedEmailsInputComponent } from './components/depecrated-emails-input/depecrated-emails-input.component';
import { DepecratedDateFutureComponent } from './components/depecrated-date-future/depecrated-date-future.component';
import { DepecratedTicketComponent } from './components/depecrated-ticket/depecrated-ticket.component';
import { DepecratedApproversAndControllersComponent } from './components/depecrated-approvers-and-controllers/depecrated-approvers-and-controllers.component';
import { DepecratedCurrencyAndAmountComponent } from './components/depecrated-currency-and-amount/depecrated-currency-and-amount.component';
import { DepecratedCurrencyFlagComponent } from './components/depecrated-currency-flag/depecrated-currency-flag.component';
import { DepecratedMyAccountsComponent } from './components/depecrated-my-accounts/depecrated-my-accounts.component';
import { DepecratedSourceAccountsComponent } from './components/depecrated-source-accounts/depecrated-source-accounts.component';
import { DepecratedCompanyLimitsComponent } from './components/depecrated-company-limits/depecrated-company-limits.component';
import { DepecratedSaveFavoritesComponent } from './components/depecrated-save-favorites/depecrated-save-favorites.component';
import { DepecratedListOfMonthsComponent } from './components/depecrated-list-of-months/depecrated-list-of-months.component';
import { DepecratedDateRangePickerComponent } from './components/depecrated-date-range-picker/depecrated-date-range-picker.component';
import { DepecratedInformationPanelComponent } from './components/depecrated-information-panel/depecrated-information-panel.component';
import { DepecratedGlossaryTermsComponent } from './cw-components/depecrated-glossary-terms/depecrated-glossary-terms.component';
import { DepecratedBeneficiaryFormAbroadComponent } from './cw-components/depecrated-beneficiary-form-abroad/depecrated-beneficiary-form-abroad.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
//import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NewStepperComponent } from './cw-components/new-stepper/new-stepper.component';
import { SharedRoutingModule } from './shared-routing.module';
import { DirectivesModule } from '../../Directives/directives.module';
import { DialogElementsComponent } from './cw-components/dialog-elements/dialog-elements.component';
import { NewLoaderComponent } from './components/new-loader/new-loader.component';
import { NewStepComponent } from './cw-components/new-step/new-step.component';
import { DialogUpdateUserInfoComponent } from './cw-components/dialog-update-user-info/dialog-update-user-info.component';
import { AdminModule } from '../admin/admin.module';
//import { BootstrapRootComponent } from './components/bootstrap-root/bootstrap-root.component';
//import { Ng2SearchPipeModule } from 'ng2-search-filter/src/ng2-filter.module';

//import { MyDatePickerModule } from 'mydatepicker';


@NgModule({
  imports: [
    /* CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    DirectivesModule,
    AppMaterialModule,
    Ng2SearchPipeModule, */
    CommonModule,
    SharedRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    DirectivesModule,
    //AdminModule
  ],
  declarations: [
    ApproversAndControllersComponent,
    ApproversAndControllersDetailComponent,
    ApproversAndControllersListComponent,
    BanksSearcherComponent,
    BarRouteComponent,
    LoaderComponent,
    ButtonGroupComponent,
    ButtonGroupContentComponent,
    CompanyLimitsComponent,
    CurrencyAndAmountComponent,
    CurrencyFlagComponent,
    DateFutureComponent,
    DateRangeComponent,
    EmailsInputComponent,
    FundsModalComponent,
    InformationPanelComponent,
    IntermediaryBankFormAbroadComponent,
    ListOfMonthsComponent,
    ModalComponent,
    ModalIsBlockComponent,
    MyAccountsComponent,
    NumberPadComponent,
    PaginationComponent,
    PasswordValidationComponent,
    PrePreparerModalComponent,
    RequesterFormAbroadComponent,
    SelectMonthComponent,
    ShowErrorsComponent,
    SourceAccountsComponent,
    StepComponent,
    StepperComponent,
    StepperDetailComponent,
    SuccessfulOperationModalComponent,
    TicketComponent,
    TokenComponent,
    TokenModalComponent,
    TransferCategoriesAsfiComponent,
    CaptchaComponent,
    CompanyNameComponent,
    DepecratedPaginationComponent,
    DepecratedEmailsInputComponent,
    DepecratedDateFutureComponent,
    DepecratedTicketComponent,
    DepecratedApproversAndControllersComponent,
    DepecratedCurrencyAndAmountComponent,
    DepecratedCurrencyFlagComponent,
    DepecratedMyAccountsComponent,
    DepecratedSourceAccountsComponent,
    DepecratedCompanyLimitsComponent,
    DepecratedSaveFavoritesComponent,
    DepecratedListOfMonthsComponent,
    DepecratedDateRangePickerComponent,
    DepecratedInformationPanelComponent,
    DepecratedGlossaryTermsComponent,
    DepecratedBeneficiaryFormAbroadComponent,
    UploadFileComponent,
    NewStepperComponent,


    ShowErrorsComponent,
    DialogElementsComponent,
    NewLoaderComponent,
    LoaderComponent,
    ModalComponent,
    NewStepperComponent,
    NewStepComponent,
    NumberPadComponent,
    DialogUpdateUserInfoComponent,
    StepperComponent,
    //BootstrapRootComponent
  ],
  exports: [
    ShowErrorsComponent,
    LoaderComponent,
    CaptchaComponent,
    ModalComponent,
    DepecratedPaginationComponent,
    NumberPadComponent,
    TokenComponent,
    TokenModalComponent,
    DirectivesModule,
    DepecratedEmailsInputComponent,
    DepecratedDateFutureComponent,
    DepecratedTicketComponent,
    DepecratedApproversAndControllersComponent,
    DepecratedCurrencyAndAmountComponent,
    DepecratedCurrencyFlagComponent,
    DepecratedMyAccountsComponent,
    DepecratedSourceAccountsComponent,
    DepecratedCompanyLimitsComponent,
    DepecratedSaveFavoritesComponent,
    CompanyNameComponent,
    DepecratedListOfMonthsComponent,
    RequesterFormAbroadComponent,
    DepecratedBeneficiaryFormAbroadComponent,
    IntermediaryBankFormAbroadComponent,
    BanksSearcherComponent,
    TransferCategoriesAsfiComponent,
    DepecratedDateRangePickerComponent,
    DepecratedInformationPanelComponent,
    DepecratedGlossaryTermsComponent,
    DepecratedInformationPanelComponent,
    BarRouteComponent,
    ButtonGroupComponent,
    ButtonGroupContentComponent,
    StepComponent,
    StepperComponent,
    DepecratedCurrencyAndAmountComponent,
    SourceAccountsComponent,
    ApproversAndControllersComponent,
    CompanyLimitsComponent,
    CurrencyAndAmountComponent,
    CurrencyFlagComponent,
    DateFutureComponent,
    EmailsInputComponent,
    MyAccountsComponent,
    TicketComponent,
    InformationPanelComponent,
    PaginationComponent,
    DateRangeComponent,
    SelectMonthComponent,
    ApproversAndControllersListComponent,
    ListOfMonthsComponent,
    ApproversAndControllersDetailComponent,
    FundsModalComponent,
    ModalIsBlockComponent,
    SuccessfulOperationModalComponent,
    StepperDetailComponent,
    PrePreparerModalComponent,
    NewStepperComponent,
    ShowErrorsComponent,
    DialogElementsComponent,
    NewLoaderComponent,
    LoaderComponent,
    ModalComponent,
    NewStepperComponent,
    NewStepComponent,
    NumberPadComponent,
    StepperComponent
    //MyDatePickerModule

  ],
  providers: [DecimalPipe],
  //bootstrap: [AppComponent],
})
export class SharedModule {

  constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  }
}
