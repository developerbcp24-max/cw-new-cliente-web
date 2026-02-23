import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { NgOtpInputModule } from 'ng-otp-input';

import { AdminRoutingModule } from './admin-routing.module';
import { ContainerComponent } from './components/container/container.component';
import { LoginComponent } from './login/login.component';
import { MasterLoginComponent } from './master-login/master-login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppMaterialModule } from '../angular.material/app.material.module';
import { SharedModule } from '../shared/shared.module';
import { VirtualPathComponent } from './components/virtual-path/virtual-path.component';
import { BreakingNewsComponent } from './breaking-news/breaking-news.component';
import { JwtModule } from '../../Jwt/jwt.module';
import { GlobalComponent } from './components/global/global.component';
import { ManualsComponent } from './manuals/manuals.component';
import { MacrosComponent } from './components/macros/macros.component';
import { QuestionsComponent } from './questions/questions.component';
import { GenerateKeyComponent } from './generate-key/generate-key.component';
import { SecurityCertificateComponent } from './components/security-certificate/security-certificate.component';
import { ValidatePinComponent } from './components/validate-pin/validate-pin.component';
import { CreatePasswordComponent } from './components/create-password/create-password.component';
import { CreateAliasComponent } from './components/create-alias/create-alias.component';
import { DirectivesModule } from '../../Directives/directives.module';
import { StrengthPasswordComponent } from './components/strength-password/strength-password.component';
import { GenerateAliasComponent } from './generate-alias/generate-alias.component';
import { ValidateUserComponent } from './components/validate-user/validate-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';
import { StepRegisterComponent } from './components/step-register/step-register.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { CompanyConditionsComponent } from './components/company-conditions/company-conditions.component';
import { AddingUsersComponent } from './components/adding-users/adding-users.component';
import { FinalizeRegistrationComponent } from './components/finalize-registration/finalize-registration.component';
import { DialogNotificationComponent } from './components/dialog-notification/dialog-notification.component';
import { ObfuscateEmailPipe } from '../../Pipes/obfuscate-email.pipe';
import { CwRolesDialogComponent } from './components/cw-roles-dialog/cw-roles-dialog.component';
import { TermsConditionsDialogComponent } from './components/terms-conditions-dialog/terms-conditions-dialog.component';
import { UserInfoDialogComponent } from './components/user-info-dialog/user-info-dialog.component';
import { RegisterButtonsComponent } from './components/register-buttons/register-buttons.component';
import { FormatAccountPipe } from '../../Pipes/format-account.pipe';
import { ObfuscateAccountNumberPipe } from '../../Pipes/obfuscate-account-number.pipe';
import { AffiliationDocumentDialogComponent } from './components/affiliation-document-dialog/affiliation-document-dialog.component';
import { MobileContainerComponent } from './components/mobile-container/mobile-container.component';
import { ImgModalComponent } from './components/img-modal/img-modal.component';
import { NewStrengthPasswordComponent } from './components/new-strength-password/new-strength-password.component';
import { SlideCheckDialogComponent } from './components/slide-check-dialog/slide-check-dialog.component';
import { RegisterMobileComponent } from './register-mobile/register-mobile.component';
import { RegisterMobileTabsComponent } from './components/register-mobile-tabs/register-mobile-tabs.component';
import { RegisterMobileAnnexComponent } from './components/register-mobile-annex/register-mobile-annex.component';
import { RegisterMobileSignatureComponent } from './components/register-mobile-signature/register-mobile-signature.component';
import { RegisterMobileCompleteComponent } from './components/register-mobile-complete/register-mobile-complete.component';
import { RegisterMobileAnnexDialogComponent } from './components/register-mobile-annex-dialog/register-mobile-annex-dialog.component';
import { RegisterMobileFacialRecognitionComponent } from './components/register-mobile-facial-recognition/register-mobile-facial-recognition.component';
import { MasterPageComponent } from './master-page/master-page.component';
import { MovementsAndBalancesComponent } from './movements-and-balances/movements-and-balances.component';
import { MovementsListComponent } from './movements-list/movements-list.component';
import { TotalBalancesComponent } from './components/total-balances/total-balances.component';
import { BalancesListComponent } from './components/balances-list/balances-list.component';
import { HeaderDashboardComponent } from './components/header-dashboard/header-dashboard.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { WhatsAppIaComponent } from './components/whats-app-ia/whats-app-ia.component';
import { UrlSecureCwComponent } from './components/url-secure-cw/url-secure-cw.component';
import { FaqComponent } from './components/pages-default/faq/faq.component';
import { FunctionsFeaturesComponent } from './components/pages-default/functions-features/functions-features.component';


@NgModule({
  declarations: [
    ContainerComponent,
    LoginComponent,
    MasterLoginComponent,
    HeaderComponent,
    FooterComponent,
    VirtualPathComponent,
    BreakingNewsComponent,
    GlobalComponent,
    ManualsComponent,
    MacrosComponent,
    QuestionsComponent,
    GenerateKeyComponent,
    SecurityCertificateComponent,
    ValidatePinComponent,
    CreatePasswordComponent,
    CreateAliasComponent,
    StrengthPasswordComponent,
    GenerateAliasComponent,
    ValidateUserComponent,
    ChangePasswordComponent,
    RegisterComponent,
    StepRegisterComponent,
    PersonalInformationComponent,
    CompanyConditionsComponent,
    AddingUsersComponent,
    FinalizeRegistrationComponent,
    DialogNotificationComponent,
    CwRolesDialogComponent,
    TermsConditionsDialogComponent,
    UserInfoDialogComponent,
    RegisterButtonsComponent,
    AffiliationDocumentDialogComponent,
    MobileContainerComponent,
    ImgModalComponent,
    NewStrengthPasswordComponent,
    SlideCheckDialogComponent,
    RegisterMobileComponent,
    RegisterMobileTabsComponent,
    RegisterMobileAnnexComponent,
    RegisterMobileSignatureComponent,
    RegisterMobileCompleteComponent,
    RegisterMobileAnnexDialogComponent,
    RegisterMobileFacialRecognitionComponent,
    MasterPageComponent,
    MovementsAndBalancesComponent,
    MovementsListComponent,
    TotalBalancesComponent,
    BalancesListComponent,
    HeaderDashboardComponent,
    BreadCrumbComponent,
    WhatsAppIaComponent,
    UrlSecureCwComponent,
    FaqComponent,
    FunctionsFeaturesComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    JwtModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    DirectivesModule,
    QRCodeComponent,
    ObfuscateEmailPipe,
    FormatAccountPipe,
    ObfuscateAccountNumberPipe,
    NgOtpInputModule,
  ],
  exports: [
    ContainerComponent,
    GlobalComponent,
    MacrosComponent,
    QRCodeComponent,
    MobileContainerComponent,
    HeaderDashboardComponent,
    BreadCrumbComponent,
    FaqComponent,
    FunctionsFeaturesComponent,
  ],
  providers: [DecimalPipe]
})
export class AdminModule {}
