import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ServicePaymentsService } from '../../../Services/service-payments/service-payments.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { GetDebtRequest } from '../../../Services/service-payments/models/get-debt-request';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { DelapazDebt } from '../../../Services/service-payments/models/delapaz-debt';
import { ServicePayment } from '../../../Services/service-payments/models/service-payment';
import { Constants } from '../../../Services/shared/enums/constants';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { ClientCodeComponent } from '../components/client-code/client-code.component';
import { Router } from '@angular/router';
import { GlobalService } from '../../../Services/shared/global.service';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { ServiceTypes } from '../../../Services/shared/enums/service-types';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { SaveFavorite } from '../../../Services/shared/models/save-favorite';
import { SendBill } from '../../../Services/service-payments/models/send-bill';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { CreSaguapacDebt } from '../../../Services/service-payments/models/cre-saguapac-debt';
import { ElfecDto } from '../../../Services/elfec/models/elfec-dto';
import { ElfecPaymentDto } from '../../../Services/elfec/models/elfec-payment-dto';
import { ElfecService } from '../../../Services/elfec/elfec.service';
import { ElfecDebtResponse } from '../../../Services/elfec/models/elfec-debt-response';
import { ServicesResult } from '../../../Services/service-pase/models/services-result';
import { ServicesDto } from '../../../Services/service-pase/models/services-dto';
import { ServicePaseService } from '../../../Services/service-pase/service-pase.service';
import { ServicesPaseDto } from '../../../Services/service-pase/models/services-pase-dto';
import { GetDebtsResult } from '../../../Services/epsas/models/get-debts-result';
import { NgForm } from '@angular/forms';
import { PaymentTypeComponent } from '../components/payment-type/payment-type.component';

@Component({
  selector: 'app-electricity',
  standalone: false,
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.css'],
  providers: [ServicePaymentsService, UtilsService, ElfecService, ServicePaseService]
})
export class ElectricityComponent implements OnInit {

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
  scheduleOperation = false;
  paymentInformation: any;
  successfulPaymentMessage = Constants.successfulTransactionMessage;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild('creClientCode') creClientCodeComponent!: ClientCodeComponent;
  @ViewChild('delapazClientCode') delapazClientCodeComponent!: ClientCodeComponent;
  @ViewChild('delapazClientCode') delapazForm!: NgForm;
  @ViewChild('paymentType') paymentType!: PaymentTypeComponent;
  isPreSave = false;
  serviceTypeNumber!: number;
  constants: Constants = new Constants();
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;
  elfecPaymentDto: ElfecPaymentDto = new ElfecPaymentDto();
  arrayElfec = [];
  elfecDto = new ElfecDto();
  detailElfec: ElfecDebtResponse = new ElfecDebtResponse();
  typeOperation!: number;
  disabledF = true;
  swServicePase: any;
  cre = 'CRE';
  delapaz = 'DELAPAZ';

  servicesResult: ServicesResult[] = [];
  typeService!: number;
  isDelapaz = false;
  servicePaymnetPaseDto = new ServicesPaseDto();
  delapazDebt!: GetDebtsResult;

  constructor(router: Router, private servicePayment: ServicePaymentsService, private messageService: GlobalService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private elfecService: ElfecService,
    private paseService: ServicePaseService) {
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
    this.paymentInformation.amount = this.servicePaymnetPaseDto.amount = this.elfecDto.amount = 0;
    this.paymentInformation.currency = this.servicePaymnetPaseDto.currency = this.elfecDto.currency = Constants.currencyBol;
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
    this.paymentInformation.sourceAccountId = this.servicePaymnetPaseDto.sourceAccountId = this.elfecDto.sourceAccountId = $event.id;
    this.paymentInformation.sourceAccount = this.servicePaymnetPaseDto.sourceAccount = this.elfecDto.sourceAccount = $event.number;
  }

  handleDateFuture($event: DateFutureModel) {
    this.paymentInformation.isScheduledProcess = this.servicePaymnetPaseDto.isScheduledProcess = this.elfecDto.isScheduledProcess = $event.isDateFuture;
    this.paymentInformation.scheduledProcess = this.servicePaymnetPaseDto.scheduledProcess = this.elfecDto.scheduledProcess = $event.date;
    if ($event.isDateFuture) {
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.excedeedAmount = true;
      } else {
        this.showToken();
      }
    }
  }

  handleGroupChanged($event: number) {
    this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    this.typeService = 0;
    this.isDelapaz = false;
    if ($event === 0) {
      this.getDebtRequest.service = '1';
      this.elfecDto.operationTypeId = undefined!;
      this.typeOperation = 0;
      this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    } else if (this.swServicePase[0] && $event === 1) {
      this.getDebtRequest.service = ServiceTypes.Delapaz.toString(); this.elfecDto.operationTypeId = undefined!;
      this.paymentInformation.operationTypeId = this.servicePaymnetPaseDto.operationTypeId = OperationType.pagoServicioPase;
      this.typeOperation = 1; this.isDelapaz = true;
      this.typeService = ServiceTypes.Delapaz;
    } else if (this.swServicePase[1] && $event === 2) {
      this.paymentInformation.operationTypeId = this.elfecDto.operationTypeId = OperationType.pagoServicioElfec;
      this.typeOperation = 2;
      this.getDebtRequest.service = undefined!;
    }
    this.restartDetailOfDebts();
    if (this.paymentInformation.operationTypeId === OperationType.pagoServicioPase) {
      this.handleGetService();
      this.paymentType.handleGetFavorite(this.typeService);
    }
  }

  handleGetService() {
    if (this.typeOperation !== 0) {
      this.paseService.getServices(new ServicesDto({companyCode : this.typeService}))
      .subscribe({next: response => {
        this.servicesResult = response;
      }, error: _err => this.messageService.info('Servicio Pase ', 'Por favor vuelva a intentarlo mas tarde.')});
    }
 }

  handleServiceListChanged($event: any) {
    this.getDebtRequest.service = $event.value;
    this.restartDetailOfDebts();
  }

  handleOnNewSearch() {
    this.restartDetailOfDebts();
  }

  handleElfecDto($event: any) {
    this.elfecDto.nus = $event.nus;
    this.elfecDto.accountNumber = $event.accountNumber;
  }

  handleGetDebtChanged($event: any) {
    if ($event !== undefined) {
      if (this.paymentInformation.operationTypeId === OperationType.pagoServicioPase) {
        this.delapazDebt = $event;
        this.delapazDebt = this.delapazDebt.quotas.length > 0 ? this.delapazDebt : undefined!;
      } else if (this.paymentInformation.operationTypeId === OperationType.pagoServicioElfec) {
        this.detailElfec = $event;
      } else {
        this.creSaguapacDebt = $event;
      }
    }
  }

  handleFavoritePaymentCheckChanged($event: any) {
    if (!$event) {
      this.restartDetailOfDebts();
    }
  }

  handleGetDebtsDto($event: any) {
    this.servicePaymnetPaseDto.parameters = $event.parameters;
  }

  handleDebtDetailChanged($event: any) {
    if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.servicePaymnetPaseDto.servicesPasePayments = $event;
      this.servicePaymnetPaseDto.amount = $event.length > 0 ? Math.round(($event.reduce((sum: any, item: any) => sum + item.amount, 0)) * 1e12) / 1e12 : 0;
    } else if (this.elfecDto.operationTypeId === OperationType.pagoServicioElfec) {
      this.elfecDto.elfecPayments = $event;
      this.elfecDto.amount = this.elfecDto.elfecPayments.length > 0 ? Math.round((this.elfecDto.elfecPayments.reduce((sum, item) => sum + item.amount, 0)) * 1e12) / 1e12 : 0;
    } else {
      this.paymentInformation.creSaguapacPayment = $event;
      this.paymentInformation.amount = Math.round(($event.reduce((sum: any, item: any) => sum + item.amount, 0)) * 1e12) / 1e12;
    }
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.paymentInformation.approvers = this.servicePaymnetPaseDto.approvers = this.elfecDto.approvers = $event.approvers;
    this.paymentInformation.controllers = this.servicePaymnetPaseDto.controllers = this.elfecDto.controllers = $event.controllers;
    this.paymentInformation.cismartApprovers = this.servicePaymnetPaseDto.cismartApprovers = this.elfecDto.cismartApprovers = $event.cismartApprovers;
  }

  handleSaveFavoriteChanged($event: SaveFavorite) {
    this.paymentInformation.isFavorite = this.servicePaymnetPaseDto.isFavorite = this.elfecDto.isFavorite = $event.isFavorite;
    this.paymentInformation.favoriteName = this.servicePaymnetPaseDto.favoriteName = this.elfecDto.favoriteName = $event.name;
  }

  restartDetailOfDebts() {
    this.paymentInformation.creSaguapacPayment = undefined!;
    this.paymentInformation.delapazPayment = undefined!;
    this.creSaguapacDebt = undefined!;
    this.delapazDebt = undefined!;
    this.elfecDto.elfecPayments = this.detailElfec  = undefined!;
    this.disabledF = true;
  }

  handleSendBillChanged($event: SendBill) {
    this.paymentInformation.billAddress = $event;
  }

  handleValidate(billValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean,emailsValidation: boolean, isBtnPresave: boolean) {
    if (billValidation && approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && emailsValidation && this.amountValidation()) {
      this.paymentInformation.isPrePreparer = this.servicePaymnetPaseDto.isPrePreparer = this.elfecDto.isPrePreparer = this.isPreSave = isBtnPresave;
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.paymentInformation.amount)) {
        this.excedeedAmount = true;
      } else if (!this.isPreSave) {
        this.showToken();
      }
    }
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
  }

  handleValidateForScheduleOperation(approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.scheduleOperation = true;
    }
  }

  clientCodeFormValidation() {
    if (+this.getDebtRequest.service === ServiceTypes.Cre) {
      return this.creClientCodeComponent.handleValidate();
    } else {
      return true;
    }
  }

  amountValidation() {
    if (this.elfecDto.operationTypeId === OperationType.pagoServicioElfec) {
      if (this.elfecDto.elfecPayments.length > 0) {
        this.paymentInformation.amount = this.elfecDto.elfecPayments[0].amount;
      }
    } else if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.paymentInformation.amount = this.servicePaymnetPaseDto.amount;
    }
    if (this.paymentInformation.amount === 0) {
      this.messageService.info('Validación', ' El monto de la operación no puede ser cero.');
      return false;
    }
    return true;
  }

  handleInformation() {
    if (this.elfecDto.operationTypeId === OperationType.pagoServicioElfec) {
      this.paymentInformation.operationTypeName = this.elfecDto.operationTypeName = this.constants.elfecService;
      this.elfecDto.sourceAccount = this.paymentInformation.sourceAccount;
      return;
    } else if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.paymentInformation.operationTypeId = OperationType.pagoServicioPase;
      this.paymentInformation.operationTypeName = this.constants.delapazService;
    }
    switch (Number(this.getDebtRequest.service)) {
      case 1:
        this.paymentInformation.operationTypeName = this.constants.creService;
        break;

    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.handleInformation();
    this.elfecDto.sendVouchers = this.paymentInformation.sendVouchers;
    if (!this.paymentInformation.isPrePreparer) {
      this.paymentInformation.tokenCode = this.servicePaymnetPaseDto.tokenCode = this.elfecDto.tokenCode = $event.code;
      this.paymentInformation.tokenName = this.servicePaymnetPaseDto.tokenName = this.elfecDto.tokenName = $event.name;
    }
    this.isTokenFormDisabled = true;
    if (this.elfecDto.operationTypeId === OperationType.pagoServicioElfec) {
      this.handleSaveElfec();
    } else if (this.servicePaymnetPaseDto.operationTypeId === OperationType.pagoServicioPase) {
      this.servicePaymnetPaseDto.servicesPasePayments.forEach(x => x.companyCode = x.companyCode.trim());
      this.handleSaveServicePase();
    } else {
      this.handelSavePayment();
    }
  }
  handleSaveElfec() {
    this.elfecService.savePayment(this.elfecDto)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => { this.messageService.info('Operación fallida: ', _err.message); this.isTokenFormDisabled = false; }});
  }

  handelSavePayment() {
    this.servicePayment.savePayment(this.paymentInformation)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => { this.messageService.info('Operación fallida: ', _err.message); this.isTokenFormDisabled = false; }});
  }

  handleSaveServicePase()  {
    this.paseService.savePayment(this.servicePaymnetPaseDto)
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
