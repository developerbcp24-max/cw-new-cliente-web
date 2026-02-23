import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { CreSaguapacDebt } from '../../../Services/service-payments/models/cre-saguapac-debt';
import { DelapazDebt } from '../../../Services/service-payments/models/delapaz-debt';
import { GetDebtRequest } from '../../../Services/service-payments/models/get-debt-request';
import { SendBill } from '../../../Services/service-payments/models/send-bill';
import { ServicePayment } from '../../../Services/service-payments/models/service-payment';
import { Telephony } from '../../../Services/service-payments/models/telephony';
import { ServicePaymentsService } from '../../../Services/service-payments/service-payments.service';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { ServiceTypes } from '../../../Services/shared/enums/service-types';
import { GlobalService } from '../../../Services/shared/global.service';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { SaveFavorite } from '../../../Services/shared/models/save-favorite';
import { UtilsService } from '../../../Services/shared/utils.service';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { ClientCodeComponent } from '../components/client-code/client-code.component';
import { TelephonyComponent } from '../components/telephony/telephony.component';
import { Constants } from '../../../Services/shared/enums/constants';

@Component({
  selector: 'app-service-payment',
  standalone: false,
  templateUrl: './service-payment.component.html',
  styleUrls: ['./service-payment.component.css'],
  providers: [ServicePaymentsService, UtilsService]
})
export class ServicePaymentComponent implements OnInit {

  isTokenFormDisabled = false;
  isVisibleToken = false;
  isTelephony = false;
  isClientCode = false;
  isPaymentSuccessful = false;
  excedeedAmount = false;
  isDisabledForm = false;
  showCompanyLimits = false;
  processBatchNumber = 0;
  accountRequest: AccountDto;
  account: AccountResult;
  getDebtRequest: GetDebtRequest;
  creSaguapacDebt!: CreSaguapacDebt;
  approversDto: InputApprovers;
  delapazDebt!: DelapazDebt;
  scheduleOperation = false;
  paymentInformation: ServicePayment;
  successfulPaymentMessage = Constants.successfulTransactionMessage;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild('creClientCode') creClientCodeComponent!: ClientCodeComponent;
  @ViewChild('delapazClientCode') delapazClientCodeComponent!: ClientCodeComponent;
  @ViewChild('saguapacClientCode') saguapacClientCodeComponent!: ClientCodeComponent;
  @ViewChild('fixedTelephony') fixedTelephonyComponent!: TelephonyComponent;
  @ViewChild('mobileTelephony') mobileTelephonyComponent!: TelephonyComponent;
  isPreSave = false;
  serviceTypeNumber = 0;
  constants: Constants = new Constants();
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;

  constructor(router: Router, private servicePayment: ServicePaymentsService, private messageService: GlobalService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef) {
    router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.account = new AccountResult();
    this.getDebtRequest = new GetDebtRequest();
    this.approversDto = new InputApprovers();
    this.accountRequest = new AccountDto();
    this.paymentInformation = new ServicePayment();
  }

  ngOnInit() {
    this.accountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    this.paymentInformation.amount = 0;
    this.paymentInformation.currency = Constants.currencyBol;
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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

  handleTelephonyChanged($event: Telephony) {
    this.paymentInformation.telephonyPayment = $event;
    this.paymentInformation.telephonyPayment.serviceTypeId = this.getDebtRequest.service;
  }

  handleDateFuture($event: DateFutureModel) {
    this.paymentInformation.isScheduledProcess = $event.isDateFuture;
    this.paymentInformation.scheduledProcess = $event.date;
    if ($event.isDateFuture) {
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.excedeedAmount = true;
      } else {
        this.showToken();
      }
    }
  }

  handleGroupChanged($event: number) {
    switch ($event) {
      case 0: this.getDebtRequest.service = '1'; break;
      case 1: this.getDebtRequest.service = '2'; break;
      case 2: this.getDebtRequest.service = '11'; break;
      case 3: this.getDebtRequest.service = '3'; break;
      case 4: this.getDebtRequest.service = '4'; break;
    }
    this.isTelephony = +this.getDebtRequest.service === ServiceTypes.TelefoniaFija || +this.getDebtRequest.service === ServiceTypes.TelefoniaMovil;
    this.isClientCode = !this.isTelephony && this.getDebtRequest.service != null;
    this.restartDetailOfDebts();
  }

  handleServiceListChanged($event: any) {
    this.getDebtRequest.service = $event.value;
    this.isTelephony = $event.value === ServiceTypes.TelefoniaFija || $event.value === ServiceTypes.TelefoniaMovil;
    this.isClientCode = !this.isTelephony && this.getDebtRequest.service != null;
    this.restartDetailOfDebts();
  }

  handleOnNewSearch() {
    this.restartDetailOfDebts();
  }

  handleGetDebtChanged($event: any) {
    if (+this.getDebtRequest.service === ServiceTypes.Delapaz) {
      this.delapazDebt = $event;
    } else {
      this.creSaguapacDebt = $event;
    }
  }

  handleFavoritePaymentCheckChanged($event: any) {
    if (!$event) {
      this.restartDetailOfDebts();
    }
  }

  handleDebtDetailChanged($event: any) {
    if (+this.getDebtRequest.service === ServiceTypes.Delapaz) {
      this.paymentInformation.delapazPayment = $event;
      this.paymentInformation.amount = $event.amount;
    } else {
      this.paymentInformation.creSaguapacPayment = $event;
      this.paymentInformation.amount = Math.round(($event.reduce((sum: any, item: any) => sum + item.amount, 0)) * 1e12) / 1e12;
    }
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.paymentInformation.approvers = $event.approvers;
    this.paymentInformation.controllers = $event.controllers;
    this.paymentInformation.cismartApprovers = $event.cismartApprovers;
  }

  handleSaveFavoriteChanged($event: SaveFavorite) {
    this.paymentInformation.isFavorite = $event.isFavorite;
    this.paymentInformation.favoriteName = $event.name;
  }

  restartDetailOfDebts() {
    this.paymentInformation.amount = 0;
    this.paymentInformation.creSaguapacPayment = undefined!;
    this.paymentInformation.delapazPayment = undefined!;
    this.creSaguapacDebt = undefined!;
    this.delapazDebt = undefined!;
  }

  handleSendBillChanged($event: SendBill) {
    this.paymentInformation.billAddress = $event;
  }

  handleValidate(billValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (billValidation && approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.paymentInformation.isPrePreparer = false;
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.excedeedAmount = true;
      } else {
        this.showToken();
      }
    }
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      if (!this.paymentInformation.isPrePreparer) {
        this.showToken();
      } else {
        this.handleTokenSubmit(new TokenCredentials());
      }
    }
  }

  handleValidateNoToken(billValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (billValidation && approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.paymentInformation.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  handleValidateForScheduleOperation(approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.scheduleOperation = true;
    }
  }

  clientCodeFormValidation() {
    switch (+this.getDebtRequest.service) {
      case ServiceTypes.Cre: return this.creClientCodeComponent.handleValidate();
      case ServiceTypes.Saguapac: return this.saguapacClientCodeComponent.handleValidate();
      case ServiceTypes.Delapaz: return this.delapazClientCodeComponent.handleValidate();
      case ServiceTypes.TelefoniaFija: return this.fixedTelephonyComponent.handleValidate();
      case ServiceTypes.TelefoniaMovil: return this.mobileTelephonyComponent.handleValidate();
    }
    return;
  }

  amountValidation() {
    if (this.paymentInformation.amount === 0) {
      this.messageService.danger('Validación', ' El monto de la operación no puede ser cero.');
      return false;
    }
    return true;
  }

  handleInformation() {
    switch (Number(this.getDebtRequest.service)) {
      case 1:
        this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
        this.paymentInformation.operationTypeName = this.constants.creService;
        break;
      case 2:
        this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
        this.paymentInformation.operationTypeName = this.constants.delapazService;
        break;
      case 11:
        this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
        this.paymentInformation.operationTypeName = this.constants.saguapacService;
        break;
      case 3:
      case 4:
        this.paymentInformation.operationTypeId = OperationType.pagoDeServiciosTelefonía;
        break;
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.handleInformation();
    if (!this.paymentInformation.isPrePreparer) {
      this.paymentInformation.tokenCode = $event.code;
      this.paymentInformation.tokenName = $event.name;
    }
    this.isTokenFormDisabled = true;
    this.servicePayment.savePayment(this.paymentInformation)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => { this.messageService.info('Operación fallida', 'Por favor vuelva a intentarlo mas tarde.');
      this.isTokenFormDisabled = false; }});
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
