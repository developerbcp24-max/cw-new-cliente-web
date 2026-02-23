import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { UtilsService } from '../../../Services/shared/utils.service';
import { SaveFavorite } from '../../../Services/shared/models/save-favorite';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { Constants } from '../../../Services/shared/enums/constants';
import { GetClientResponse } from '../../../Services/telephone-services/models/get-client-response';
import { GetDebtsClientEntelDto } from '../../../Services/telephone-services/models/get-debts-client-entel-dto';
import { EntelDto } from '../../../Services/telephone-services/models/entel-dto';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { SendBillComponent } from '../components/send-bill/send-bill.component';
import { GlobalService } from '../../../Services/shared/global.service';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { TelephoneServicesService } from '../../../Services/telephone-services/telephone-services.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { DebtDetailComunicationComponent } from '../components/debt-detail-comunication/debt-detail-comunication.component';
import { UserService } from '../../../Services/users/user.service';
import { SendBill } from '../../../Services/service-payments/models/send-bill';
import { PaymentTypeComponent } from '../components/payment-type/payment-type.component';
import { GetDebtsResponse } from '../../../Services/tigo-payments/models/get-debts-response';
import { TigoDto, TigoDetailPaymentDto } from '../../../Services/tigo-payments/models/tigo-dto';
import { TigoPaymentsService } from '../../../Services/tigo-payments/tigo-payments.service';
import { ServicePayment } from '../../../Services/service-payments/models/service-payment';
import { NewPaseService } from '../../../Services/new-pase/new-pase.service';
import { ServicesDto } from '../../../Services/service-pase/models/services-dto';
import { GetServicesResult } from '../../../Services/new-pase/models/get-services-result';
import { ServiceTypes } from '../../../Services/shared/enums/service-types';
import { GetDebtsDto } from '../../../Services/service-pase/models/get-debts-dto';
import { GetDebtsResult } from '../../../Services/new-pase/models/get-debts-result';
import { NgForm } from '@angular/forms';
import { NewPasePaymentDto } from '../../../Services/new-pase/models/new-pase-payment-dto';
import { NewPaseDto } from '../../../Services/new-pase/models/new-pase-dto ';
import { FavoriteServicesPaymentDto } from '../../../Services/service-pase/models/favorite-services-payment-dto';
import { FavoritePaymentDto } from '../../../Services/new-pase/models/favorite-payment-dto';
import { FavoriteNewPaseResult } from '../../../Services/new-pase/models/favorite-new-pase-result';
import { IdDto } from '../../../Services/shared/models/id-dto';
import { AddPaymentModalComponent } from '../components/add-payment-modal/add-payment-modal.component';

@Component({
  selector: 'app-comunication',
  standalone: false,
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.css'],
  providers: [UtilsService, TelephoneServicesService, TigoPaymentsService, NewPaseService]
})
export class ComunicationComponent implements OnInit {

  isDisabledForm = false;
  isPaymentSuccessful = false;
  processBatchNumber = 0;
  accountRequest: AccountDto;
  account!: AccountResult;
  approversDto: InputApprovers;
  swServicePase: any;
  typeService!: number;
  servicesResult: Constants = new Constants();
  entelDto: EntelDto;
  tigoDto: TigoDto = new TigoDto;
  billintType = false;
  getDebtsDetail: GetClientResponse[] = [];
  getTigoDebtsDetail: GetDebtsResponse = new GetDebtsResponse();
  totalDebts = 0;
  debtsByDetail: GetDebtsClientEntelDto[] = [];
  constants: Constants = new Constants();
  isPreSave = false;
  scheduleOperation = false;
  isVisibleToken = false;
  isTokenFormDisabled = false;
  excedeedAmount = false;
  showCompanyLimits = false;
  showDetail = false;
  showDataBillint = false;
  amountDebts = 0;
  is_validbatchtoken: boolean;
  isTigo = false;
  isEntel = false;
  isCotas = false;
  isAxs = false;
  isComteco = false;
  @ViewChild('sendBill') dataBilling!: SendBillComponent;
  @ViewChild('debtDetail') debtDetail!: DebtDetailComunicationComponent;
  @ViewChild('paymentType') paymentType!: PaymentTypeComponent;
  @ViewChild('detailForm') detailForm!: NgForm;
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  @ViewChild('addPayment') addPayment!: AddPaymentModalComponent;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  paymentInformation: ServicePayment = new ServicePayment();
  detailTigo: TigoDetailPaymentDto = new TigoDetailPaymentDto();
  showDetailForm = false;
  branchOffice: Constants = new Constants();
  branchOfficeCode = '201';
  centralOffice = 'OFICINA CENTRAL';

  resultParameters: GetServicesResult = new GetServicesResult();
  getDebtsDto: GetDebtsDto = new GetDebtsDto();
  telephoneNumber: any = [];
  getServicesResult: GetServicesResult[] = [];
  getDebtsResult: GetDebtsResult[] = [];
  showDetailDebts = false;
  debtsDetailCotas: GetDebtsResult = new GetDebtsResult();
  showSaveFavoriteForm = false;
  newPasePaymentDto: NewPasePaymentDto[] = [];
  paymentInformationCotas: Array<string>[] = [];
  newPaseDto: NewPaseDto = new NewPaseDto();
  line = 0;
  favoriteNewPaseResult: FavoriteNewPaseResult[] = [];
  favoriteItem: any;
  favoritePaymentDto: FavoritePaymentDto[] = [];
  idDto: IdDto = new IdDto();
  isValidServiceCotas = true;
  isVoucherDetail = false;
  companyCode!: number;

  constructor(private utilsService: UtilsService, private globalService: GlobalService, private tigoPaymentsService: TigoPaymentsService,
    private cdRef: ChangeDetectorRef, private telephoneServicesService: TelephoneServicesService,
    private userService: UserService, private newPaseService: NewPaseService) {
    this.accountRequest = new AccountDto();
    this.entelDto = new EntelDto();
    this.approversDto = new InputApprovers();
    this.swServicePase = this.utilsService.getFlagServicePase();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }

  ngOnInit() {
    this.accountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.paymentInformation.operationTypeId = this.entelDto.operationTypeId = OperationType.pagoServicioEntel;
    this.tigoDto.operationTypeId = OperationType.pagoServicioTigo;
    this.newPaseDto.amount = this.entelDto.amount = this.tigoDto.amount = 0;
    this.newPaseDto.currency = this.entelDto.currency = this.tigoDto.currency = Constants.currencyBol;
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
    this.newPaseDto.sourceAccountId = this.entelDto.sourceAccountId = this.tigoDto.sourceAccountId = $event.id;
    this.newPaseDto.sourceAccount = this.entelDto.sourceAccount = this.tigoDto.sourceAccount = $event.number;
  }
  handleBillingType($event: any) {
    this.billintType = $event;
    this.entelDto.isComission = this.tigoDto.isComission = this.billintType;
  }

  handleGroupChanged($event: number) {
    this.handleResetForm();
    this.isEntel = this.isTigo = this.isCotas = this.isAxs = this.isComteco = false;
    this.isVoucherDetail = false;
    if (this.paymentType != undefined) {
      this.paymentType.handelResetForm();
    }
    if (this.debtDetail != undefined) {
      this.debtDetail.handleResetForm();
    }
    if (this.swServicePase[4] && $event == 0) {
      this.isEntel = true;
      this.paymentInformation.operationTypeId = OperationType.pagoServicioEntel;
    } else if (this.swServicePase[5] && $event == 1) {
      this.isTigo = true;
      this.paymentInformation.operationTypeId = OperationType.pagoServicioTigo;
    }
    else if (this.swServicePase[6] && $event == 2) {
      this.paymentInformation.operationTypeId = OperationType.pagoServicioNewPase;
      this.showDataBillint = true;
      this.isCotas = true;
      this.isVoucherDetail = true;
      this.line = 0;
      this.companyCode = ServiceTypes.Cotas;
      this.newPaseDto.companyCode = ServiceTypes.Cotas.toString();
      this.newPaseService.getServices(new ServicesDto({ companyCode: this.companyCode }))
        .subscribe({next: response => {
          this.isValidServiceCotas = true;
          this.getServicesResult = response;
        }, error: _err => {
          this.isValidServiceCotas = false;
        }});
    }
  }

  changeDetail($event: any) {
    this.showDetail = $event;
    this.entelDto.isComission = this.billintType = false;
  }

  changeDetailBilling($event: any) {
    this.showDataBillint = $event;
    this.entelDto.isComission = this.billintType = false;
  }
  handleResetForm() {
    this.getDebtsDetail = [];
    this.showDetail = false;
    this.showDataBillint = false;
    this.entelDto.amount = 0;
    this.entelDto.entelPaymentDetail = [];
    this.tigoDto.amount = 0;
    this.tigoDto.detailPayments = [];
    this.favoriteItem = undefined;
    this.favoritePaymentDto = [];
  }

  handleGetDebtChanged($event: any) {
    this.handleResetForm();
    this.totalDebts = 0;
    this.amountDebts = 0
    this.getDebtsDetail = $event;
    if (this.getDebtsDetail !== undefined) {
      if (this.isTigo) {
        if ($event > 0) {
          this.showDataBillint = true;
          this.totalDebts = 1;
          this.amountDebts = $event;
        } else {
          this.getTigoDebtsDetail = $event;
          this.tigoDto.client = this.getTigoDebtsDetail.client;
          this.tigoDto.contract = this.getTigoDebtsDetail.contract;
          this.totalDebts = this.getTigoDebtsDetail.debts.length;
          this.getTigoDebtsDetail.debts = this.getTigoDebtsDetail.debts.length > 0 ? this.getTigoDebtsDetail.debts : undefined!;
        }
      } else {
        this.totalDebts = this.getDebtsDetail.length;
        this.getDebtsDetail = this.getDebtsDetail.length > 0 ? this.getDebtsDetail : undefined!;
        this.amountDebts = 0;
      }
    }

  }

  changePaymentType($event: any) {
    if ($event) {
      this.entelDto.searchCode = this.entelDto.parameters = this.entelDto.name = undefined!;
      this.entelDto.isComission = this.billintType = false;
      this.tigoDto.searchCode = this.tigoDto.parameters = undefined!;
      this.tigoDto.isComission = this.billintType = false;
      this.totalDebts = 0;
      this.getDebtsDetail = [];
      this.debtsByDetail = [];
      this.getTigoDebtsDetail.debts = [];
    }
  }

  handleGetDebtsDto($event: any) {
    if (this.isEntel) {
      this.debtsByDetail = $event;
      this.entelDto.searchCode = $event.searchCode;
      this.entelDto.parameters = $event.parameters;
      this.entelDto.name = this.servicesResult.searchCodeEntel.find(x => x.serviceCode == $event.searchCode)!.nameCompany;
      this.entelDto.company = this.userService.getUserToken().company_name;
    } else if (this.isTigo) {
      this.tigoDto.searchCode = $event.searchCode;
      this.tigoDto.parameters = $event.accountNumber;
    }
  }
  handleSaveFavoriteChanged($event: SaveFavorite) {
    this.entelDto.isFavorite = this.tigoDto.isFavorite = $event.isFavorite;
    this.entelDto.favoriteName = this.tigoDto.favoriteName = $event.name;
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.newPaseDto.approvers = this.entelDto.approvers = this.tigoDto.approvers = $event.approvers;
    this.newPaseDto.controllers = this.entelDto.controllers = this.tigoDto.controllers = $event.controllers;
    this.newPaseDto.cismartApprovers = this.entelDto.cismartApprovers = this.tigoDto.cismartApprovers = $event.cismartApprovers;
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      if (!this.entelDto.isPrePreparer) {
        this.showToken();
      } else {
        this.handleTokenSubmit(new TokenCredentials());
      }
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.handleInformation();
    if (!this.entelDto.isPrePreparer) {
      this.newPaseDto.tokenCode = this.entelDto.tokenCode = this.tigoDto.tokenCode = $event.code;
      this.newPaseDto.tokenName = this.entelDto.tokenName = this.tigoDto.tokenName = $event.name;
    }
    if (this.isEntel) {
      this.handleSaveService();
    } else if (this.isTigo) {
      this.handleSaveTigoService();
    } else if (this.isCotas || this.isAxs) {
      this.handleSaveCotasService();
    }
  }

  handleValidate(debtsDetailValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    let isValidSendBilling = true;
    if (this.billintType) {
      isValidSendBilling = this.dataBilling.handleValidate()!;
    }
    if (this.isCotas || this.isAxs) {
      this.newPaseDto.amount = this.entelDto.amount = this.amountDebts;
    }
    this.entelDto.amount = this.tigoDto.amount = this.debtDetail.handleInformation().amount == undefined ? 0 : this.debtDetail.handleInformation().amount;
    if (this.entelDto.amount == 0) {
      this.globalService.danger('Validación: ', ' El monto no debe ser 0, debe selecionar una deuda.');
    }
    if (!debtsDetailValidation) {
      this.globalService.danger('Validación: ', ' Debe completar los Datos de Factura.');
    }
    if (debtsDetailValidation && approversAndControllersValidation && approversLimitValidation && isValidSendBilling && sourceAccountValidation && this.amountValidation()) {
      this.newPaseDto.isPrePreparer = this.entelDto.isPrePreparer = this.tigoDto.isPrePreparer = false;
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.entelDto.amount)) {
        this.excedeedAmount = true;
      } else {
        this.showToken();
      }
    }

  }

  handleValidateNoToken(debtsDetailValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    this.entelDto.amount = this.tigoDto.amount = this.debtDetail.handleInformation().amount == undefined ? 0 : this.debtDetail.handleInformation().amount;
    if (this.isCotas || this.isAxs) {
      this.newPaseDto.amount = this.entelDto.amount = this.amountDebts;
    }
    if (this.entelDto.amount == 0) {
      this.globalService.danger('Validación: ', ' El monto no debe ser 0, debe selecionar una deuda.');
    }
    if (!debtsDetailValidation) {
      this.globalService.danger('Validación: ', ' Debe completar los Datos de Factura.');
    }
    if (debtsDetailValidation && approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.newPaseDto.isPrePreparer = this.entelDto.isPrePreparer = this.tigoDto.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  handleValidateForScheduleOperation(approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean) {
    if (approversAndControllersValidation && approversLimitValidation && this.clientCodeFormValidation() && sourceAccountValidation && this.amountValidation()) {
      this.scheduleOperation = true;
    }
  }

  clientCodeFormValidation() {
    if (this.entelDto.isComission) {
      return this.dataBilling.handleValidate();
    } else {
      return true;
    }
  }

  amountValidation() {
    if (this.entelDto.amount === 0) {
      this.globalService.danger('Validación: ', ' El monto de la operación no puede ser cero.');
      return false;
    }
    return true;
  }

  handleSendBillChanged($event: SendBill) {
    this.newPaseDto.isStreet = this.entelDto.isStreet = this.tigoDto.isStreet = $event.streetType == 'Calle' ? true : false;
    this.newPaseDto.streetOrAvenue = this.entelDto.streetOrAvenue = this.tigoDto.streetOrAvenue = $event.streetName;
    this.newPaseDto.number = this.entelDto.number = this.tigoDto.number = $event.doorNumber;
    this.newPaseDto.floorOrDepartament = this.entelDto.floorOrDepartament = this.tigoDto.floorOrDepartament = $event.floor;
    this.newPaseDto.batchOrCondominium = this.entelDto.batchOrCondominium = this.tigoDto.batchOrCondominium = $event.lot;
    this.newPaseDto.location = this.entelDto.location = this.tigoDto.location = $event.location;
    this.newPaseDto.province = this.entelDto.province = this.tigoDto.province = $event.province;
    this.newPaseDto.departament = this.entelDto.departament = this.tigoDto.departament = $event.city;
    this.newPaseDto.zoneOrNeighborhood = this.entelDto.zoneOrNeighborhood = this.tigoDto.zoneOrNeighborhood = $event.neighborhood;
  }

  handleInformation() {
    if (this.isEntel) {
      this.paymentInformation.operationTypeName = this.entelDto.operationTypeName = this.constants.telephonyServiceEntel;
      let result = this.debtDetail.handleInformation();
      this.entelDto.isComission = result.isComission;
      this.entelDto.nameBill = result.nameBill;
      this.entelDto.nitFactura = result.nitFactura;
      this.entelDto.service = result.service;
      this.entelDto.serviceDescription = result.serviceDescription;
      this.entelDto.serviceName = result.paymentType;
      this.entelDto.paymentDescription = result.paymentDescription;
      this.entelDto.paymentType = result.serviceName;
      this.entelDto.entelPaymentDetail = result.entelPaymentDetail;
      this.entelDto.streetOrAvenue = this.billintType ? this.entelDto.streetOrAvenue : result.streetOrAvenue;
    } else if (this.isTigo) {
      this.paymentInformation.operationTypeName = this.tigoDto.operationTypeName = this.constants.telephonyServiceTigo;
      let result = this.debtDetail.handleInformationTigo();
      this.tigoDto.isComission = result.isComission;
      this.tigoDto.nameBill = result.nameBill;
      this.tigoDto.nitFactura = result.nitFactura;
      this.tigoDto.streetOrAvenue = this.billintType ? this.tigoDto.streetOrAvenue : result.streetOrAvenue;
      this.tigoDto.detailPayments = result.detailPayments;
      if (this.tigoDto.searchCode == '1') {
        this.detailTigo.amount = this.detailTigo.balance = this.tigoDto.amount;
        this.tigoDto.detailPayments.push(this.detailTigo);
      }
    } else if (this.isCotas || this.isAxs) {
      if (this.isCotas) {
        this.paymentInformation.operationTypeName = this.newPaseDto.operationTypeName = this.constants.telephonyServiceCotas;
      } else if (this.isAxs) {
        this.paymentInformation.operationTypeName = this.newPaseDto.operationTypeName = this.constants.serviceAxs;
      }
      let result = this.debtDetail.handleInformationCotas();
      this.newPaseDto.isComission = result.isComission;
      this.newPaseDto.nameBill = result.nameBill;
      this.newPaseDto.nitFactura = result.nitFactura;
      this.newPaseDto.streetOrAvenue = this.billintType ? this.newPaseDto.streetOrAvenue : result.streetOrAvenue;
    }
  }

  updateParameters($event: string) {
    this.entelDto.parameters = $event;
  }

  handleSaveService() {
    this.telephoneServicesService.savePayment(this.entelDto)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.globalService.info('Pago de Entel: ', _err.message);
        this.isTokenFormDisabled = false;
      }});
  }

  handleSaveTigoService() {
    this.tigoPaymentsService.savePayment(this.tigoDto)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.globalService.info('Pago de Tigo: ', _err.message);
        this.isTokenFormDisabled = false;
      }});
  }

  handleSaveCotasService() {
    if (this.newPaseDto.isFavorite) {
      let line = 0;
      for (let item of this.newPaseDto.newPasePayments) {
        let resultFav = this.newPaseDto.favoritePayments.find(x => x.parameters === item.parameters);
        if (resultFav == undefined) {
          line = line + 1;
          this.newPaseDto.favoritePayments.push({
            line: line,
            parameters: item.parameters,
            serviceCode: item.serviceCode,
            companyCode: ''
          });
        }
      }
    }
    this.newPaseService.savePayment(this.newPaseDto)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.globalService.info('Pago de Servicio: ', _err.message);
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

  handleAddRow() {
    this.getDebtsDto.serviceCode = undefined!;
    this.resultParameters = new GetServicesResult();
    this.debtsDetailCotas = new GetDebtsResult();
    this.getDebtsResult = [];
    this.telephoneNumber = [];
    this.showDetailForm = true;

  }

  changeAmount($event: any) {
    if (typeof $event == 'boolean') {
      this.showDetailForm = $event;
    } else {
      this.newPasePaymentDto = $event[0].dto;
      this.amountDebts = $event[0].amount;
      this.totalDebts = $event[0].total;
      this.showDetailForm = $event[0].showModal;
    }
  }

  changeDebts($event: any) {
    this.newPaseDto.newPasePayments = $event.newPasePayments;
  }

  handleRemoveRow($event: any): void {
    for (let i = 0; i < this.newPasePaymentDto.length; i++) {
      if (this.newPasePaymentDto[i].line === $event.line) {
        this.newPasePaymentDto.splice(i, 1);
        this.amountDebts = Number(this.amountDebts) - Number($event.amount);
        if (this.newPasePaymentDto.length == 0) {
          this.amountDebts = 0;
        }
      }
    }
    if (this.newPasePaymentDto.length == 0) {
      this.amountDebts = 0;
    }
    this.totalDebts = this.newPasePaymentDto.length;
  }

  validateRemoveDebts($event: any) {
    let re = /[/-]/gi;
    let periodNumber = $event.period.replace(re, '').trim();
    let newPeriod = Number(periodNumber);
    let isRemove = true;
    this.newPasePaymentDto.forEach((value, index) => {
      let aux = value.period.replace(re, '').trim();
      let periodDetail = Number(aux);
      isRemove = newPeriod >= periodDetail ? true : false;
    });
    if (isRemove) {
      this.handleRemoveRow($event);
    } else {
      this.globalService.info('Nota.- ', 'Solo puede eliminar la última deuda.');
    }
  }

  handleShowFavorite() {
    if (this.amountDebts > 0) {
      this.newPaseDto.favoriteName = undefined!;
      this.showSaveFavoriteForm = true;
    }
  }

  handleSaveFavorite($event: any) {
    if (typeof $event == 'boolean') {
      this.showSaveFavoriteForm = $event;
    } else {
      this.newPaseDto.isFavorite = $event[0].isFavorite;
      this.newPaseDto.favoriteName = $event[0].nameFav;
      this.showSaveFavoriteForm = $event[0].showModal;
    }
  }

  handleGroupChangedCotas($event: any) {
    this.favoritePaymentDto = [];
    if ($event == 1) {
      this.favoriteItem = undefined;
      this.handleGetFavorites();
    }
  }

  handleGetFavorites() {
    this.newPaseService.getFavorite(new FavoriteServicesPaymentDto({ companyCode: this.companyCode }))
      .subscribe({next: response => {
        this.favoriteNewPaseResult = response;
        this.isValidServiceCotas = true;
      }, error: _err => {
        this.isValidServiceCotas = false;
      }});
  }

  handleChangeFavorite() {
    this.favoritePaymentDto = [];
  }

  handleCancelFavorite() {
    this.newPaseDto.isFavorite = false;
    this.newPaseDto.favoriteName = undefined!;
  }

  handleRemoveFavorite() {
    this.idDto.id = this.favoriteItem.id;
    this.newPaseService.deleteFavoriteById(this.idDto)
      .subscribe({next: (response: any) => {
        this.handleGetFavorites();
        this.favoriteItem = undefined;
        this.favoritePaymentDto = [];
        this.globalService.info('Favoritos: ', 'El pago se eliminó correctamente.');
      }, error: _err => {
        this.globalService.info('Favoritos: ', 'El pago no se pudo eliminar.');
        //console.log(_err);
      }});
  }

  handleSearchFavorite() {
    this.resultParameters.parameters = [];
    this.getDebtsResult = [];
    this.newPaseService.getFavoriteById(new IdDto({ Id: this.favoriteItem.id }))
      .subscribe({next: response => {
        this.favoritePaymentDto = response;
      }, error: _err => {
        this.globalService.info('Favorito Cotas: ', _err.message);
      }});
  }

  handleSearchFavoriteById(clientCode: any) {
    this.resultParameters = new GetServicesResult();
    this.resultParameters.parameters = [];
    this.getDebtsResult = [];
    this.showDetailDebts = false;
    this.telephoneNumber = [];
    this.getDebtsDto.serviceCode = clientCode.serviceCode;
    this.resultParameters.parameters.push({
      name: clientCode.parameters,
      description: '',
      numberOfParameters: "1"
    });
    this.telephoneNumber.push(clientCode.parameters);
    this.showDetailForm = true;

  }
}
