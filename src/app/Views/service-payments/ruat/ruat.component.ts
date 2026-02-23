import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { RuatPayment } from '../../../Services/ruat/models/ruat-payment';
import { ServicePaymentsService } from '../../../Services/service-payments/service-payments.service';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Constants } from '../../../Services/shared/enums/constants';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { GlobalService } from '../../../Services/shared/global.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { PropertyDebtComponent } from '../components/property-debt/property-debt.component';
import { VehicleDebtComponent } from '../components/vehicle-debt/vehicle-debt.component';

@Component({
  selector: 'app-ruat',
  standalone: false,
  templateUrl: './ruat.component.html',
  styleUrls: ['./ruat.component.css'],
  providers: [UtilsService, ServicePaymentsService]
})
export class RuatComponent implements OnInit {

  accountDto!: AccountDto;
  approversDto: InputApprovers;
  account!: AccountResult;
  isVisibleToken = false;
  isPaymentSuccessful = false;
  excedeedAmount = false;
  isDisabledForm = false;
  showCompanyLimits = false;
  isTokenFormDisabled = false;
  processBatchNumber = 0;
  successfulPaymentMessage = Constants.successfulTransactionMessage;
  paymentInformation: RuatPayment = new RuatPayment();
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild(PropertyDebtComponent) propertyDebtComponent!: PropertyDebtComponent;
  @ViewChild(VehicleDebtComponent) vehicleDebtComponent!: VehicleDebtComponent;

  constants: Constants = new Constants();
  isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;

  constructor(private utilsService: UtilsService, private messageService: GlobalService, private servicePaymentService: ServicePaymentsService) {
    this.approversDto = new InputApprovers();
    this.paymentInformation.amount = 0;
  }

  ngOnInit() {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    this.paymentInformation.currency = Constants.currencyBol;
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }

  handleGroupChanged($event: number) {
    switch ($event) {
      case 0:
        this.vehicleDebtComponent.restartForm();
        this.paymentInformation.service = Constants.ruatVehicles;
        break;
      case 1:
        this.propertyDebtComponent.restartForm();
        this.paymentInformation.service = Constants.ruatProperties;
        break;
    }
  }

  handleSourceAccountChanged($event: AccountResult) {
    this.approversDto = new InputApprovers({
      operationTypeId: OperationType.pagoDeServicios,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      accountNumber: $event.formattedNumber
    });
    this.account = $event;
    this.paymentInformation.sourceAccountId = $event.id;
    this.paymentInformation.sourceAccount = $event.number;
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.paymentInformation.approvers = $event.approvers;
    this.paymentInformation.controllers = $event.controllers;
    this.paymentInformation.cismartApprovers = $event.cismartApprovers;
  }

  requestFormIsValid(): boolean {
    switch (this.paymentInformation.service) {
      case Constants.ruatVehicles: return this.vehicleDebtComponent.handleValidate()!;
      case Constants.ruatProperties: return this.propertyDebtComponent.handleValidate()!;
    }
    return this.propertyDebtComponent.handleValidate()!;
  }

  handleValidate(emailsValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (emailsValidation && approversAndControllersValidation && approversLimitValidation && sourceAccountValidation && this.requestFormIsValid() && this.paymentInformation.amount > 0) {
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.excedeedAmount = true;
      } else {
        this.showToken();
      }
    }
  }

  handleValidateNoToken(emailsValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (emailsValidation && approversAndControllersValidation && approversLimitValidation && sourceAccountValidation && this.requestFormIsValid() && this.paymentInformation.amount > 0) {
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.paymentInformation.isPrePreparer = true;
        this.isPreSave = true;
      }
    }
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
  }

  handleInformation() {
    switch (this.paymentInformation.service) {
      case 'V':
        this.paymentInformation.operationTypeName = this.constants.vehicleRuatService;
        break;
      case 'I':
        this.paymentInformation.operationTypeName = this.constants.propertyRuatService;
        break;
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.handleInformation();
    this.paymentInformation.tokenCode = $event.code;
    this.paymentInformation.tokenName = $event.name;
    this.isTokenFormDisabled = true;
    this.servicePaymentService.saveRuatPayment(this.paymentInformation)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isDisabledForm = this.isPaymentSuccessful = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.messageService.info('Operación fallida', 'Por favor vuelva a intentarlo mas tarde.');
        this.isTokenFormDisabled = false;
      }});
  }

  showToken() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res) {
          this.isVisibleToken = true;
        }
      }});
  }
}
