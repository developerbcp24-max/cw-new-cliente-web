import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AutoDisbursementComponent } from './auto-disbursement/auto-disbursement.component';
import { BallotOfWarrantyComponent } from './ballot-of-warranty/ballot-of-warranty.component';
import { ClaimRequestComponent } from './claim-request/claim-request.component';
import { FavoritePaymentsSettingsComponent } from './favorite-payments-settings/favorite-payments-settings.component';
import { ModificationRequestComponent } from './modification-request/modification-request.component';
import { NewBallotOfWarrantyComponent } from './new-ballot-of-warranty/new-ballot-of-warranty.component';
/* components */
import { BailDataComponent } from './components/bail-data/bail-data.component';
import { DeliveryInstructionsComponent } from './components/delivery-instructions/delivery-instructions.component';
import { GradualAmortizationComponent } from './components/gradual-amortization/gradual-amortization.component';
import { ModificationsRequestStep1Component } from './components/modifications-request-step1/modifications-request-step1.component';
import { ModificationsRequestStep2Component } from './components/modifications-request-step2/modifications-request-step2.component';
import { ModificationsRequestStep3Component } from './components/modifications-request-step3/modifications-request-step3.component';
import { NewBailDataComponent } from './components/new-bail-data/new-bail-data.component';
import { NewBallotInstructionsComponent } from './components/new-ballot-instructions/new-ballot-instructions.component';
import { NewOtherGuaranteesComponent } from './components/new-other-guarantees/new-other-guarantees.component';
import { NewOthersOfBallotComponent } from './components/new-others-of-ballot/new-others-of-ballot.component';
import { NewSecuringDataComponent } from './components/new-securing-data/new-securing-data.component';
import { OtherGuaranteesComponent } from './components/other-guarantees/other-guarantees.component';
import { OthersOfBallotComponent } from './components/others-of-ballot/others-of-ballot.component';
import { RoedataComponent } from './components/roedata/roedata.component';
import { SecuringDataComponent } from './components/securing-data/securing-data.component';
import { SelectTypeBallotComponent } from './components/select-type-ballot/select-type-ballot.component';
/* Favorites */
import { AchComponent } from './components/favorite-spreadsheets/ach/ach.component';
import { CashComponent } from './components/favorite-spreadsheets/cash/cash.component';
import { ProvidersComponent } from './components/favorite-spreadsheets/providers/providers.component';
import { SalariesComponent } from './components/favorite-spreadsheets/salaries/salaries.component';
import { OperationsRoutingModule } from './operations-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { DirectivesModule } from '../../Directives/directives.module';
import { MassPaymentsModule } from '../mass-payments/mass-payments.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppMaterialModule } from '../angular.material/app.material.module';
import { AdminModule } from '../admin/admin.module';




@NgModule({
  declarations: [
    AutoDisbursementComponent,
    BallotOfWarrantyComponent,
    ClaimRequestComponent,
    FavoritePaymentsSettingsComponent,
    ModificationRequestComponent,
    NewBallotOfWarrantyComponent,
    BailDataComponent,
    DeliveryInstructionsComponent,
    GradualAmortizationComponent,
    ModificationsRequestStep1Component,
    ModificationsRequestStep2Component,
    ModificationsRequestStep3Component,
    NewBailDataComponent,
    NewBallotInstructionsComponent,
    NewOtherGuaranteesComponent,
    NewOthersOfBallotComponent,
    NewSecuringDataComponent,
    OtherGuaranteesComponent,
    OthersOfBallotComponent,
    RoedataComponent,
    SecuringDataComponent,
    SelectTypeBallotComponent,
    AchComponent,
    CashComponent,
    ProvidersComponent,
    SalariesComponent
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    FormsModule,
    SharedModule,
    DirectivesModule,
    MassPaymentsModule,
    VouchersModule,
    MatDatepickerModule,
    AppMaterialModule,
    //AdminModule

  ],
  providers: [DecimalPipe]
})
export class OperationsModule {
  /* constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/bootstrap-ops.css';
    document.head.appendChild(link);
  } */
 }
