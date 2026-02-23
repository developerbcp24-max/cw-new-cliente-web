import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ServicePaymentsService } from '../../../Services/service-payments/service-payments.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { GetDebtRequest } from '../../../Services/service-payments/models/get-debt-request';
import { CreSaguapacDebt } from '../../../Services/service-payments/models/cre-saguapac-debt';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ServicePayment } from '../../../Services/service-payments/models/service-payment';
import { Constants } from '../../../Services/shared/enums/constants';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { ClientCodeComponent } from '../components/client-code/client-code.component';
import { Router } from '@angular/router';
import { GlobalService } from '../../../Services/shared/global.service';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { ServiceTypes } from '../../../Services/shared/enums/service-types';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { SaveFavorite } from '../../../Services/shared/models/save-favorite';
import { SendBill } from '../../../Services/service-payments/models/send-bill';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { GetDebtsResult } from '../../../Services/epsas/models/get-debts-result';
import { ServicePaseService } from '../../../Services/service-pase/service-pase.service';
import { ServicesDto } from '../../../Services/service-pase/models/services-dto';
import { ServicesResult } from '../../../Services/service-pase/models/services-result';
import { ServicesPaseDto } from '../../../Services/service-pase/models/services-pase-dto';
import { PaymentTypeComponent } from '../components/payment-type/payment-type.component';

@Component({
  selector: 'app-water',
  standalone: false,
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css'],
  providers: [ServicePaymentsService, UtilsService, ServicePaseService]
})
export class WaterComponent implements OnInit {

  isTokenFormDisabled = false;
  isVisibleToken = false;
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
  epsasDebt!: GetDebtsResult;
  approversDto: InputApprovers;
  scheduleOperation = false;
  paymentInformation: any;
  successfulPaymentMessage = Constants.successfulTransactionMessage;
  delapazDebt!: any;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild('saguapacClientCode') saguapacClientCodeComponent!: ClientCodeComponent;
  @ViewChild('paymentType') paymentType!: PaymentTypeComponent;
  @ViewChild('paymentTypeSemapa') paymentTypeSemapa!: PaymentTypeComponent;

  isPreSave = false;
  serviceTypeNumber = 0;
  constants: Constants = new Constants();
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;

  typeService!: number;
  servicesResult: ServicesResult[] = [];
  servicePaymnetPaseDto = new ServicesPaseDto();
  swServicePase: any;

  constructor(router: Router, private servicePayment: ServicePaymentsService, private paseService: ServicePaseService, private messageService: GlobalService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef) {
    router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.account = new AccountResult();
    this.getDebtRequest = new GetDebtRequest();
    this.approversDto = new InputApprovers();
    this.accountRequest = new AccountDto();
    this.paymentInformation = new ServicePayment();
    this.swServicePase = this.utilsService.getFlagServicePase();
  }

  ngOnInit() {
    this.accountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    this.paymentInformation.amount = this.servicePaymnetPaseDto.amount = 0;
    this.paymentInformation.currency = this.servicePaymnetPaseDto.currency = Constants.currencyBol;
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
    this.paymentInformation.sourceAccountId = this.servicePaymnetPaseDto.sourceAccountId = $event.id;
    this.paymentInformation.sourceAccount = this.servicePaymnetPaseDto.sourceAccount = $event.number;
  }

  handleDateFuture($event: DateFutureModel) {
    this.paymentInformation.isScheduledProcess = this.servicePaymnetPaseDto.isScheduledProcess = $event.isDateFuture;
    this.paymentInformation.scheduledProcess = this.servicePaymnetPaseDto.scheduledProcess = $event.date;
    if ($event.isDateFuture) {
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.excedeedAmount = true;
      } else {
        this.showToken();
      }
    }
  }

  handleGroupChanged($event: number) {
    this.creSaguapacDebt = this.epsasDebt = null!;
    this.typeService = 0;

    if ($event === 0) {
      this.getDebtRequest.service = '11';
      this.typeService = 0;
      this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    } else if (this.swServicePase[2] && $event === 1) {
      this.typeService = ServiceTypes.Epsas;
      this.paymentInformation.operationTypeId = this.servicePaymnetPaseDto.operationTypeId = OperationType.pagoServicioPase;
    } else if (this.swServicePase[3] && $event === 2) {
      this.typeService = ServiceTypes.Semapa;
      this.paymentInformation.operationTypeId = this.servicePaymnetPaseDto.operationTypeId = OperationType.pagoServicioPase;
    }
    if (this.paymentInformation.operationTypeId === OperationType.pagoServicioPase) {
      this.handleGetService();
      this.typeService === ServiceTypes.Epsas ? this.paymentType.handleGetFavorite(this.typeService) : this.paymentTypeSemapa.handleGetFavorite(this.typeService);
    }
    this.restartDetailOfDebts();
  }

  handleGetService() {
    this.paseService.getServices(new ServicesDto({ companyCode: this.typeService }))
      .subscribe({next: response => {
        this.servicesResult = response;
      }, error: _err => this.messageService.info('Operación fallida', 'Por favor vuelva a intentarlo mas tarde.')});
  }

  handleServiceListChanged($event: any) {
    this.getDebtRequest.service = $event.value;
    this.restartDetailOfDebts();
  }

  handleOnNewSearch() {
    this.restartDetailOfDebts();
  }

  handleGetDebtChanged($event: any) {
    if (this.paymentInformation.operationTypeId === OperationType.pagoServicioPase) {
      this.epsasDebt = $event;
      if (this.epsasDebt !== undefined) {
        this.epsasDebt = this.epsasDebt.quotas.length > 0 ? this.epsasDebt : undefined!;
      }
    } else {
      this.creSaguapacDebt = $event;
    }
  }

  handleFavoritePaymentCheckChanged($event: any) {
    if (!$event) {
      this.restartDetailOfDebts();
    }
  }

  handleGetDebtsDto($event: any) {
    if (this.epsasDebt === undefined) {
      this.epsasDebt = new GetDebtsResult();
    }
      this.servicePaymnetPaseDto.parameters = $event.parameters;
      this.epsasDebt.serviceCodeDescription = $event.serviceCodeDescription;
  }

  handleDebtDetailChanged($event: any) {
    if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.servicePaymnetPaseDto.servicesPasePayments = $event;
      this.servicePaymnetPaseDto.amount = Math.round(($event.reduce((sum: any, item: any) => sum + item.amount, 0)) * 1e12) / 1e12;
    } else {
      this.paymentInformation.creSaguapacPayment = $event;
      this.paymentInformation.amount = Math.round(($event.reduce((sum: any, item: any) => sum + item.amount, 0)) * 1e12) / 1e12;
    }
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.paymentInformation.approvers = this.servicePaymnetPaseDto.approvers = $event.approvers;
    this.paymentInformation.controllers = this.servicePaymnetPaseDto.controllers = $event.controllers;
    this.paymentInformation.cismartApprovers = this.servicePaymnetPaseDto.cismartApprovers = $event.cismartApprovers;
  }

  handleSaveFavoriteChanged($event: SaveFavorite) {
    this.paymentInformation.isFavorite = this.servicePaymnetPaseDto.isFavorite = $event.isFavorite;
    this.paymentInformation.favoriteName = this.servicePaymnetPaseDto.favoriteName = $event.name;
  }

  restartDetailOfDebts() {
    this.paymentInformation.amount = 0;
    this.paymentInformation.creSaguapacPayment = undefined!;
    this.creSaguapacDebt = undefined!;
  }

  handleSendBillChanged($event: SendBill) {
    this.paymentInformation.billAddress = $event;
  }

  handleValidate(billValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (billValidation && approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.paymentInformation.isPrePreparer = this.servicePaymnetPaseDto.isPrePreparer = false;
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
      this.paymentInformation.isPrePreparer = this.servicePaymnetPaseDto.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  handleValidateForScheduleOperation(approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.scheduleOperation = true;
    }
  }

  clientCodeFormValidation(): any {
    if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      return true;
    }
    switch (+this.getDebtRequest.service) {
      case ServiceTypes.Saguapac: return this.saguapacClientCodeComponent.handleValidate();
    }
  }

  amountValidation() {
    if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.paymentInformation.amount = this.servicePaymnetPaseDto.amount;
    }
    if (this.paymentInformation.amount === 0) {
      this.messageService.danger('Validación', ' El monto de la operación no puede ser cero.');
      return false;
    }
    return true;
  }

  handleInformation() {
    if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.paymentInformation.operationTypeId = OperationType.pagoServicioPase;
      if (this.typeService === ServiceTypes.Epsas) {
        this.paymentInformation.operationTypeName = this.constants.epsasService;
      } else if (this.typeService === ServiceTypes.Semapa) {
        this.paymentInformation.operationTypeName = this.constants.semapaService;
      }
    } else {
      this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
      this.paymentInformation.operationTypeName = this.constants.saguapacService;
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.handleInformation();
    if (!this.paymentInformation.isPrePreparer) {
      this.paymentInformation.tokenCode = this.servicePaymnetPaseDto.tokenCode = $event.code;
      this.paymentInformation.tokenName = this.servicePaymnetPaseDto.tokenName = $event.name;
    }
    this.isTokenFormDisabled = true;
    if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.servicePaymnetPaseDto.servicesPasePayments.forEach(x => x.companyCode = x.companyCode.trim());
      this.handleSaveServicePase();
    } else {
      this.handleSaveService();
    }
  }

  handleSaveServicePase() {
    this.paseService.savePayment(this.servicePaymnetPaseDto)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => { this.messageService.info('Operación fallida: ', _err.message); this.isTokenFormDisabled = false; }});
  }

  handleSaveService() {
    this.servicePayment.savePayment(this.paymentInformation)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => { this.messageService.info('Operación fallida: ', _err.message); this.isTokenFormDisabled = false; }});
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
