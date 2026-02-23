import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../Services/users/user.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { CategoryServiceDto, CategoryServicePaseResult } from '../../../Services/new-pase/models/category-service-pase-result';
import { ConfigNewServicePaseResult } from '../../../Services/new-pase/models/config-new-service-pase-result';
import { FavoriteNewPaseResult } from '../../../Services/new-pase/models/favorite-new-pase-result';
import { FavoritePaymentDto } from '../../../Services/new-pase/models/favorite-payment-dto';
import { GetServicesResult } from '../../../Services/new-pase/models/get-services-result';
import { NewPaseDto } from '../../../Services/new-pase/models/new-pase-dto ';
import { NewPaseTypeResult } from '../../../Services/new-pase/models/new-pase-type-result';
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
import { InvoiceDetailComponent } from '../components/invoice-detail/invoice-detail.component';
import { SendBillDataComponent } from '../components/send-bill-data/send-bill-data.component';

@Component({
  selector: 'app-new-pase-service',
  standalone: false,
  templateUrl: './new-pase-service.component.html',
  styleUrls: ['./new-pase-service.component.css'],
  providers: [NewPaseService, UtilsService]
})
export class NewPaseServiceComponent implements OnInit {

  categoryResult: CategoryServicePaseResult[] = [];
  accountRequest: AccountDto = new AccountDto();
  newPaseDto: NewPaseDto = new NewPaseDto();
  newPaseType: NewPaseTypeResult [] = [];
  account!: AccountResult;
  approversDto: InputApprovers;
  isValidService = true;
  isDisabledForm = false;
  isLoad = false;
  categoryCode!: string;
  processBatchNumber = 0;
  isPaymentSuccessful = false;
  is_validbatchtoken: boolean;
  isVisibleToken = false;
  isTokenFormDisabled = false;
  excedeedAmount = false;
  showCompanyLimits = false;
  isPreSave = false;
  isActiveService = false;
  showDetailForm = false;
  showInvoiceData = false;
  showInvoiceDetail = false;
  showSaveFavoriteForm = false;
  favoriteItem: any;
  departament: any;
  rubroSelected: any;
  serviceSelected: any;
  getServicesResult: GetServicesResult[] = [];
  configurationResult: ConfigNewServicePaseResult[] = [];
  favoriteNewPaseResult: FavoriteNewPaseResult[] = [];
  configResult: ConfigNewServicePaseResult = new ConfigNewServicePaseResult();
  favoritePaymentDto: FavoritePaymentDto[] = [];
  getDebtsDto: GetDebtsDto = new GetDebtsDto();
  resultParameters: GetServicesResult = new GetServicesResult();
  telephoneNumber: string[] = [];
  constants: Constants = new Constants();
  companycodeYpfb = 0;
  @ViewChild('sendBill')dataBilling!: SendBillDataComponent;
  @ViewChild('debtDetail')billDetail!: InvoiceDetailComponent;
  @ViewChild(ApproversAndControllersComponent)
  approversComponent!: ApproversAndControllersComponent;

  constructor(private globalService: GlobalService, private newPaseService: NewPaseService,
    private utilsService: UtilsService,private userService: UserService, private cdRef: ChangeDetectorRef) {
      this.approversDto = new InputApprovers();
      this.accountRequest = new AccountDto();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.getDebtsDto.isGenericPase = true;
    this.newPaseDto.isComission = false;
    this.newPaseDto.isPrePreparer = false;

    this.accountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.handleGetCategories();
    this.handleResetForm();
    this.newPaseDto.amount = 0;
    this.newPaseDto.currency = Constants.currencyBol;
    this.newPaseDto.operationTypeId = OperationType.pagoServicioNewPase;
    this.newPaseDto.isGenericPayment = true;
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
    this.newPaseDto.sourceAccountId = $event.id;
    this.newPaseDto.sourceAccount = $event.number;
  }

  /* handleGetCategories() {
    this.newPaseService.getCategoryService()
      .subscribe({next: response => {
        this.categoryResult = response;
        if (this.categoryResult.length > 0) {
          this.rubroSelected = this.categoryResult[0].code;
          this.isLoad = true;
          this.handleGroupChangedService(this.rubroSelected);
        }
      }, error: _err => {
        this.globalService.info('Rubro: ', _err.message);
      }});
  }

  handleGetPaseService($event: any) {
    this.newPaseService.getPaseService(new CategoryServiceDto({categoryCode: $event}))
      .subscribe({next: response => {
        this.newPaseType = response;
        if (this.newPaseType.length > 0){
          this.serviceSelected = this.newPaseType[0].code;
          this.handleGroupChangedService(this.serviceSelected);
          this.isValidService = true;
        }
      }, error: _err => {
        this.globalService.info('Rubros : ', _err.message);
        this.isValidService = false;
      }});
  } */
 handleGetCategories() {
  this.newPaseService.getCategoryService()
    .subscribe({
      next: response => {
        this.categoryResult = response ?? []; // asegura que sea un arreglo
        if (this.categoryResult.length > 0) {
          this.rubroSelected = this.categoryResult[0].code;
          this.isLoad = true;
          this.handleGroupChangedService(this.rubroSelected);
        }
      },
      error: _err => {
        this.globalService.info('Rubro: ', _err.message);
      }
    });
}

handleGetPaseService($event: any) {
  this.newPaseService.getPaseService(new CategoryServiceDto({categoryCode: $event}))
    .subscribe({
      next: response => {
        this.newPaseType = response ?? []; // asegura que sea un arreglo
        if (this.newPaseType.length > 0){
          this.serviceSelected = this.newPaseType[0].code;
          this.handleGroupChangedService(this.serviceSelected);
          this.isValidService = true;
        }
      },
      error: _err => {
        this.globalService.info('Rubros : ', _err.message);
        this.isValidService = false;
      }
    });
}


  handleGroupChanged() {
    this.handleGroupChangedService(this.rubroSelected);
  }

  handleGroupChangedService($event: any) {
    this.handleResetForm();
    this.isActiveService = this.showDetailForm = false;
    if (typeof $event == 'string') {
      this.handleGetPaseService($event);
    } else if (typeof $event == 'number') {
      this.isActiveService = true;
      this.newPaseDto.companyCode = $event.toString();
      this.companycodeYpfb = $event;
      this.handleGetFavorites();
    }
  }

  handleResetForm() {
    this.companycodeYpfb = 0;
    this.departament = undefined;
    this.showInvoiceData = false;
    this.showInvoiceDetail = false;
    this.configResult = new ConfigNewServicePaseResult();
    this.resultParameters = new GetServicesResult();
    this.telephoneNumber = [];
    this.newPaseDto.amount = 0;
    this.newPaseDto.nameBill = undefined!;
    this.newPaseDto.nitFactura = undefined!;
    this.newPaseDto.isComission = false;
    this.newPaseDto.streetOrAvenue = undefined!;
    this.newPaseDto.number = undefined!;
    this.newPaseDto.floorOrDepartament = undefined!;
    this.newPaseDto.batchOrCondominium = undefined!;
    this.newPaseDto.location = undefined!;
    this.newPaseDto.zoneOrNeighborhood = undefined!;
    this.newPaseDto.departament = undefined!;
    this.newPaseDto.province = undefined!;
    this.newPaseDto.favoriteName = undefined!;
    this.newPaseDto.isFavorite = false;
    this.newPaseDto.newPasePayments = [];
    this.favoriteItem = undefined!;
  }

  handleAddRow() {
    if (this.newPaseDto.companyCode == ServiceTypes.Ypfb.toString()) {
      if (this.departament == undefined) {
        this.globalService.info('Nota: ','Debe Seleccionar un departamento');
        return;
      }
    }
    this.handleDebtsNew();
    this.handleGetServices();
    this.handleGetConfiguration();
  }

  handleDebtsNew() {
    this.telephoneNumber = [];
    this.getDebtsDto.serviceCode = undefined!;
    this.resultParameters = new GetServicesResult();
    this.resultParameters.parameters = [];
    this.newPaseDto.newPasePayments = [];
    this.newPaseDto.amount = 0;
    this.configResult = new ConfigNewServicePaseResult();
  }

  handleCancelModal($event: any) {
    this.showDetailForm = $event;

  }

  handleGetServices() {
    this.getServicesResult = [];
    this.newPaseService.getServices(new ServicesDto({ companyCode: this.newPaseDto.companyCode }))
      .subscribe({next: response => {
        this.getServicesResult = response;
        this.showDetailForm = true;
      }, error: _err => {
        this.showDetailForm = false;
        this.globalService.info("Nota: ", _err);
      }});
  }

  handleGetConfiguration() {
    this.configurationResult = [];
    if (this.companycodeYpfb == ServiceTypes.Ypfb) {
      this.newPaseDto.companyCode = this.companycodeYpfb.toString();
    }
    this.newPaseService.getConfiguration(new FavoriteServicesPaymentDto({ companyCode: this.newPaseDto.companyCode }))
      .subscribe({next: response => {
        this.configurationResult = response;
        this.isValidService = true;
      }, error: _err => {
        this.isValidService = false;
      }});
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.newPaseDto.approvers = $event.approvers;
    this.newPaseDto.controllers = $event.controllers;
    this.newPaseDto.cismartApprovers = $event.cismartApprovers;
  }

  handleGetFavorites() {
    if (this.companycodeYpfb == ServiceTypes.Ypfb) {
      this.newPaseDto.companyCode = this.companycodeYpfb.toString();
    }
    this.newPaseService.getFavorite(new FavoriteServicesPaymentDto({ companyCode: this.newPaseDto.companyCode }))
      .subscribe({next: response => {
        this.favoriteNewPaseResult = response;
        this.isValidService = true;
      }, error: _err => {
        this.isValidService = false;
        this.globalService.info('Favoritos: ', _err.message);
      }});
  }

  handleChangeFavorite() {
    this.favoritePaymentDto = [];
  }

  handleSearchFavorite() {
    this.handleDebtsNew();
    this.handleGetServices();
    this.handleGetConfiguration();
    this.resultParameters.parameters = [];
    this.newPaseService.getFavoriteById(new IdDto({ Id: this.favoriteItem.id }))
      .subscribe({next: response => {
        this.favoritePaymentDto = response;
        this.getDebtsDto.serviceCode =  this.favoritePaymentDto[0].serviceCode;
        let arrayParameters = this.favoritePaymentDto[0].parameters.split('*');
        for(let item of arrayParameters) {
          this.resultParameters.parameters.push({
            name: 'Código de Cliente',
            description: '',
            numberOfParameters: "1"
          });
          this.telephoneNumber.push(item);
        }
        if (this.companycodeYpfb == ServiceTypes.Ypfb) {
          this.newPaseDto.companyCode = this.favoritePaymentDto[0].companyCode
          this.departament = this.constants.branchOfficesPase.find(x => x.value == this.newPaseDto.companyCode);
        }
        this.showDetailForm = true;
      }, error: _err => {
        this.showDetailForm = false;
        this.globalService.info('Favorito pago de servicio: ', _err.message);
      }});
  }

  handleValidate(approversAndControllersValidation: boolean, approversLimitValidation: boolean, sourceAccountValidation: boolean, isBtnPresave: boolean) {
    let isValidSendBilling = true;
    this.newPaseDto.isPrePreparer = isBtnPresave;
    this.isPreSave = isBtnPresave;
    if (this.newPaseDto.isComission) {
      isValidSendBilling = this.dataBilling.handleValidate()!;
    }
    if (this.newPaseDto.amount <= 0) {
      this.globalService.danger('Validación: ', ' El monto no debe ser menor o igual a 0.');
      return;
    }
    if (!this.billDetail.handleValidateForm()) {
      this.globalService.danger('Validación: ', ' Debe completar los Datos de Factura.');
      return;
    }
    if (this.billDetail.handleValidateForm() && approversAndControllersValidation && approversLimitValidation && isValidSendBilling && sourceAccountValidation && this.amountValidation()) {
      if (!this.newPaseDto.isPrePreparer) {
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

  handleSendBillChanged(_$event: any) {
// not implementation
  }

  handleGetBill($event: any) {
    this.newPaseDto.departament = $event.departament;
    this.newPaseDto.streetOrAvenue = $event.streetOrAvenue;
  }

  handleGetDebts($event: any) {
    this.newPaseDto.amount = $event.reduce((sum: any, item: any) => sum + item.amount, 0).toFixed(2);
    this.showInvoiceData = this.newPaseDto.amount > 0 ? true : false;
    this.showInvoiceDetail = this.showInvoiceData;
    if (this.newPaseDto.amount > 0) {
      this.configResult = this.configurationResult.find(x => !x.isDetail)!;
    }
    if (this.companycodeYpfb == ServiceTypes.Ypfb) {
      this.newPaseDto.companyCode = this.companycodeYpfb.toString();
    }
    let serviceName = this.newPaseType.find(x => x.code == Number(this.newPaseDto.companyCode))!.description;
    this.newPaseDto.operationTypeName = this.constants.genericService + serviceName;
    this.newPaseDto.newPasePayments = $event;
    for (let item of this.newPaseDto.newPasePayments) {
      item.parametersDetail = item.parameters.replace('*',' - ');
    }
    this.newPaseDto.newPasePayments.forEach(y => y.detailDescription = serviceName);
  }

  handleSaveFavorite() {
    this.newPaseDto.isFavorite = true;
    this.showSaveFavoriteForm = false;
  }

  handleCancelFavorite() {
    this.newPaseDto.favoriteName = undefined!;
    this.newPaseDto.isFavorite = false;
  }

  amountValidation() {
    if (this.newPaseDto.amount === 0) {
      this.globalService.danger('Validación: ', ' El monto de la operación no puede ser cero.');
      return false;
    }
    return true;
  }

  handleChangeBranchOffice() {
    this.newPaseDto.companyCode = this.departament.value;
  }

  showToken() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res) {
          this.isVisibleToken = true;
        }
      }});
  }

  handleTokenSubmit($event: TokenCredentials) {
    if (!this.newPaseDto.isPrePreparer) {
      this.newPaseDto.tokenCode = $event.code;
      this.newPaseDto.tokenName = $event.name;
    }
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
            companyCode: this.companycodeYpfb == ServiceTypes.Ypfb ? this.departament.value : this.newPaseDto.companyCode
          });


        }
      }
    }
    if (this.companycodeYpfb == ServiceTypes.Ypfb) {
      this.newPaseDto.newPasePayments.forEach(x => x.companyCode = ServiceTypes.Ypfb.toString());
    }

    this.newPaseDto.billingType = this.newPaseDto.newPasePayments[0].billingType!;


    this.newPaseDto.newPasePayments.forEach(x => x.IsGenericPayment = true);
    if (this.newPaseDto.newPasePayments.find(x => x.information?.includes('<br>'))) {

      this.newPaseDto.newPasePayments.forEach(x => x.information?.split('<br>').join(','));

    }
    this.newPaseDto.companyCode = this.companycodeYpfb == ServiceTypes.Ypfb ? ServiceTypes.Ypfb.toString() : this.newPaseDto.companyCode;
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

  handleRemoveFavorite() {
    this.newPaseService.deleteFavoriteById(new IdDto({ id: this.favoriteItem.id}))
      .subscribe({next: (_response: any) => {
        this.handleGetFavorites();
        this.favoriteItem = undefined;
        this.favoritePaymentDto = [];
        this.globalService.info('Favoritos: ', 'El pago se eliminó correctamente.');
      }, error: _err => {
        this.globalService.info('Favoritos: ', 'El pago no se pudo eliminar.');
      }});
  }


}
