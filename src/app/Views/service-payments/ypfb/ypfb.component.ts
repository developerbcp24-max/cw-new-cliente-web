import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { FavoriteNewPaseResult } from '../../../Services/new-pase/models/favorite-new-pase-result';
import { FavoritePaymentDto } from '../../../Services/new-pase/models/favorite-payment-dto';
import { GetDebtsResult } from '../../../Services/new-pase/models/get-debts-result';
import { GetServicesResult } from '../../../Services/new-pase/models/get-services-result';
import { NewPaseDto } from '../../../Services/new-pase/models/new-pase-dto ';
import { NewPasePaymentDto } from '../../../Services/new-pase/models/new-pase-payment-dto';
import { NewPaseService } from '../../../Services/new-pase/new-pase.service';
import { FavoriteServicesPaymentDto } from '../../../Services/service-pase/models/favorite-services-payment-dto';
import { GetDebtsDto } from '../../../Services/service-pase/models/get-debts-dto';
import { ServicesDto } from '../../../Services/service-pase/models/services-dto';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Constants } from '../../../Services/shared/enums/constants';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { ServiceTypes } from '../../../Services/shared/enums/service-types';
import { GlobalService } from '../../../Services/shared/global.service';
import { IdDto } from '../../../Services/shared/models/id-dto';
import { UtilsService } from '../../../Services/shared/utils.service';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';

@Component({
  selector: 'app-ypfb',
  standalone: false,
  templateUrl: './ypfb.component.html',
  styleUrls: ['./ypfb.component.css'],
  providers: [NewPaseService, UtilsService]
})
export class YpfbComponent implements OnInit {

  isValidService = true;
  isDisabledForm = false;
  isPaymentSuccessful = false;
  showSaveFavoriteForm = false;
  showDetailForm = false;
  isValidDep = false;
  excedeedAmount = false;
  isVisibleToken = false;
  isTokenFormDisabled = false;
  isPreSave = false;
  isFavoriteForm = false;
  showYPFB = false;
  existingRow: boolean = false;
  is_validbatchtoken: boolean;
  totalDebts = 0;
  processBatchNumber = 0;
  amountDebts = 0;
  departament: any;
  showCompanyLimits: any;
  favoriteItem: any;
  accountRequest: AccountDto;
  telephoneNumber: any = [];
  favoritePaymentDto: FavoritePaymentDto[] = [];
  newPaseDto: NewPaseDto = new NewPaseDto();
  constants: Constants = new Constants();
  approversDto: InputApprovers;
  getServicesResult: GetServicesResult[] = [];
  account!: AccountResult;
  newPasePaymentDto: NewPasePaymentDto[] = [];
  favoriteNewPaseResult: FavoriteNewPaseResult[] = [];
  getDebtsResult: GetDebtsResult[] = [];
  resultParameters: GetServicesResult = new GetServicesResult();
  getDebtsDto: GetDebtsDto = new GetDebtsDto();
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;


  constructor(private utilsService: UtilsService, private globalService: GlobalService, private cdRef: ChangeDetectorRef,
    private newPaseService: NewPaseService, private config: AppConfig) {
    this.accountRequest = new AccountDto();
    this.approversDto = new InputApprovers();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    this.showYPFB = this.config.getConfig('showYPFB');
  }

  ngOnInit() {
    this.accountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.newPaseDto.operationTypeId = OperationType.pagoServicioNewPase;
    this.newPaseDto.amount = 0;
    this.newPaseDto.currency = Constants.currencyBol;
    this.isValidDep = this.departament == undefined ? true : false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleChangeBranchOffice() {
    this.isValidDep = this.departament == undefined ? true : false;
    this.newPaseDto.companyCode = this.departament.value;
    this.handleGetServices();
  }

  handleGetServices() {
    this.newPaseService.getServices(new ServicesDto({ companyCode: this.newPaseDto.companyCode }))
      .subscribe({next: response => {
        this.isValidService = true;
        this.getServicesResult = response;
      }, error: _err => {
        this.isValidService = false;
      }});
  }

  handleSourceAccountChanged($event: AccountResult) {
    this.approversDto = new InputApprovers({
      operationTypeId: OperationType.pagoDeServicios,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      accountNumber: $event.formattedNumber
    });
    this.account = $event;
    this.newPaseDto.sourceAccountId = $event.id;
    this.newPaseDto.sourceAccount = $event.number;
  }

  handleGroupChanged($event: any) {
    this.newPaseDto.operationTypeName = this.constants.ypfbService;
  }

  handleGroupChangedPlanilla($event: any) {
    this.favoritePaymentDto = [];
    this.departament = undefined;
    this.isFavoriteForm = false;
    this.isValidDep = true;
    if ($event == 1) {
      this.isFavoriteForm = true;
      this.isValidDep = false;
      this.favoriteItem = undefined;
      this.handleGetFavorites();
    }
  }

  handleGetFavorites() {
    this.newPaseService.getFavorite(new FavoriteServicesPaymentDto({ companyCode: ServiceTypes.Ypfb.toString() }))
      .subscribe({next: response => {
        this.favoriteNewPaseResult = response;
        this.isValidService = true;
      }, error: _err => {
        this.isValidService = false;
        this.globalService.info('Pago Ypfb: ', _err.message);
      }});
  }

  handleSearchFavorite() {
    this.resultParameters.parameters = [];
    this.getDebtsResult = [];
    this.newPaseService.getFavoriteById(new IdDto({ Id: this.favoriteItem.id }))
      .subscribe({next:response => {
        this.favoritePaymentDto = response;
        this.favoritePaymentDto.forEach(x => x.departament = this.constants.branchOfficesPase.find(y => y.value == x.companyCode)!.name);
      }, error: _err => {
        this.globalService.info('Favoritos: ', _err.message);
      }});
  }

  handleAddRow() {
    this.getDebtsDto.serviceCode = undefined!;
    this.resultParameters = new GetServicesResult();
    this.getDebtsResult = [];
    this.telephoneNumber = [];
    this.showDetailForm = true;
  }

  handleShowFavorite() {
    if (this.amountDebts > 0) {
      this.newPaseDto.favoriteName = undefined!;
      this.showSaveFavoriteForm = true;
    }
  }

  handleCancelFavorite() {
    this.newPaseDto.isFavorite = false;
    this.newPaseDto.favoriteName = undefined!;
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

  handleSearchFavoriteById(det: any) {
    this.resultParameters = new GetServicesResult();
    this.resultParameters.parameters = [];
    this.getDebtsResult = [];
    this.telephoneNumber = [];
    this.newPaseDto.companyCode = det.companyCode;
    this.getDebtsDto.serviceCode = det.serviceCode;
    this.resultParameters.parameters.push({
      name: det.parameters,
      description: '',
      numberOfParameters: "1"
    });
    this.telephoneNumber.push(det.parameters);
    this.handleGetServices();
    this.showDetailForm = true;
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.newPaseDto.approvers = $event.approvers;
    this.newPaseDto.controllers = $event.controllers;
    this.newPaseDto.cismartApprovers = $event.cismartApprovers;
  }

  changeAmount($event: any) {
    if (typeof $event == 'boolean') {
      this.showDetailForm = $event;
    } else {
      this.newPasePaymentDto = $event[0].dto;
      this.newPasePaymentDto.forEach(x => x.departament = this.constants.branchOfficesPase.find(y => y.value == x.companyCode)!.name);
      this.amountDebts = $event[0].amount;
      this.totalDebts = $event[0].total;
      this.showDetailForm = $event[0].showModal;
      this.existingRow =true;
    }
  }

  handleChangeFavorite() {
    this.favoritePaymentDto = [];
  }

  validateRemoveDebts($event: any) {
    let re = /\-/gi;
    let periodNumber = $event.period.replace(re, '').trim();
    let newPeriod = Number(periodNumber);
    let isRemove = true;
    this.newPasePaymentDto.forEach((value, index) => {
      let aux = value.period.replace(re, '').trim();
      let periodDetail = Number(aux);
      if (newPeriod >= periodDetail) {
        isRemove = true;
      } else {
        isRemove = false;
      }
    });
    if (isRemove) {
      this.handleRemoveRow($event);
    } else {
      this.globalService.info('Nota.- ', 'Solo puede eliminar la última deuda.');
    }
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

  handleRemoveFavorite() {
    this.newPaseService.deleteFavoriteById(new IdDto({ Id: this.favoriteItem.id }))
      .subscribe({next: (response: any) => {
        this.handleGetFavorites();
        this.favoriteItem = undefined;
        this.favoritePaymentDto = [];
        this.globalService.info('Favoritos: ', 'El pago se eliminó correctamente.');
      }, error: _err => {
        this.globalService.info('Favoritos: ', 'El pago no spudo eliminar.');
      }});
  }

  changeDebts($event: any) {
    this.newPaseDto.newPasePayments = $event.newPasePayments;
  }

  handleValidate(approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean, isPre: boolean) {
    let isValidSendBilling = true;
    this.newPaseDto.amount = this.amountDebts;
    if (this.newPaseDto.amount == 0) {
      this.globalService.danger('Validación: ', ' El monto no debe ser 0, debe selecionar una deuda.');
    }
    if (approversAndControllersValidation && approversLimitValidation && isValidSendBilling && sourceAccountValidation && this.amountValidation()) {
      this.newPaseDto.isPrePreparer = isPre;
      if (isPre) {
        this.isPreSave = true;
      } else {
        if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.newPaseDto.amount)) {
          this.excedeedAmount = true;
        } else {
          this.showToken();
        }
      }
    }
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      if (!this.newPaseDto.isPrePreparer) {
        this.showToken();
      } else {
        this.handleTokenSubmit(new TokenCredentials());
      }
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    if (!this.newPaseDto.isPrePreparer) {
      this.newPaseDto.tokenCode = $event.code;
      this.newPaseDto.tokenName = $event.name;
    }
    this.handleSaveService();
  }

  amountValidation() {
    if (this.newPaseDto.amount === 0) {
      this.globalService.danger('Validación: ', ' El monto de la operación no puede ser cero.');
      return false;
    }
    return true;
  }

  showToken() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res) {
          this.isVisibleToken = true;
        }
      }});
  }

  handleSaveService() {
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
            companyCode: item.companyCode
          });
        }
      }
    }
    this.newPaseDto.companyCode = ServiceTypes.Ypfb.toString();
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

}
