import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { GlobalService } from '../../../Services/shared/global.service';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { ClaimRequestService } from '../../../Services/claimRequest/claim-request.service';
import { ClaimRequestDto } from '../../../Services/claimRequest/models/claim-request-dto';
import { UserService } from '../../../Services/users/user.service';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { ProductTypes } from '../../../Services/claimRequest/models/product-types';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../Services/parameters/models/parameter-dto';
import { ClaimTypes } from '../../../Services/claimRequest/models/claim-types';
import { Constants } from '../../../Services/shared/enums/constants';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import moment, { Moment } from 'moment';
import { ClaimDepartment } from '../../../Services/claimRequest/models/claim-department';
import { NgForm } from '@angular/forms';
import { ProcessBatchResult } from '../../../Services/shared/models/process-batch-result';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { Router } from '@angular/router';
import { UtilsService } from '../../../Services/shared/utils.service';

@Component({
  selector: 'app-claim-request',
  standalone: false,
  templateUrl: './claim-request.component.html',
  styleUrls: ['./claim-request.component.css'],
  providers: [AccountsService, ClaimRequestService, UtilsService]
})
export class ClaimRequestComponent implements OnInit {

  accountRequest: AccountDto = new AccountDto();
  claimType!: string;
  sourceAccountDto: AccountDto = new AccountDto();
  claimRequestDto: ClaimRequestDto = new ClaimRequestDto();
  disabled = false;
  isDisabledForm = false;
  account!: AccountResult;
  emailConfirmation!: string;
  isVisibleEmails = false;
  isVisibleAddress = false;
  productTypes!: ProductTypes[];
  productTypesSelected: ProductTypes = new ProductTypes();
  claimTypes!: ClaimTypes[];
  claimDepartments!: ClaimDepartment[];
  parameterDto: ParameterDto = new ParameterDto();
  currencies = Constants.currencies;
  dateClaimStr!: string;
  showError!: false;
  claimValue = '0';
  showDate = false;
  showAmountCurrency = false;
  typeClaim!: string;
  isChecked!: boolean;
  disabledDate = moment(new Date()).add(1, 'd').toDate();
  dateClaim: IMyDateModel = { date: null!, jsdate: null!, formatted: '', epoc: 0 };
  @ViewChild('claimForm')
  claimForm!: NgForm;
  constants: Constants = new Constants();

  numProcesBatch = 0;
  isRemoveModalVisible = false;
  isVisibleToken = false;
  serviceValue!: string;
  isValidEmail = false;
  numberAddres!: string;
  address!: string;
  transactionDate!: string;
  transactionTime!: string;
  productCode!: string;
  excedeedAmount = false;
  validateAmount = false;
  sourceAccount: AccountResult = new AccountResult();
  letterNumber!: string;
  originalEmmail!: string;

  constructor(private userService: UserService, private claimRequestService: ClaimRequestService, private router: Router, private utilsService: UtilsService,
    private messageService: GlobalService, private cdRef: ChangeDetectorRef, private parametersService: ParametersService) {
    const unique_name = userService.getUserToken().unique_name;
    this.claimRequestDto.cardNumber = unique_name!;

    this.accountRequest = {
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)]
    };
    this.claimRequestDto.operationTypeId = OperationType.formularioSolicitud;
    this.dateClaim.jsdate = new Date();
  }

  public myDatePickerOptions: IMyDpOptions = {
    editableDateField: false,
    openSelectorOnInputClick: true,
    dateFormat: 'dd/mm/yyyy',
    inline: false,
    showTodayBtn: true,
    minYear: 2000,
    maxYear: 2030,
    disableSince: { year: this.disabledDate.getFullYear(), month: this.disabledDate.getMonth() + 1, day: this.disabledDate.getDate() }
  };

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.claimRequestDto.respondeType = 0;
    this.claimRequestDto.claimType = 'REC';
    this.serviceValue = '';
    this.claimRequestDto.department = 'LP';
    this.claimRequestDto.currencyClaim = 'BOL';
    this.claimRequestDto.branchOffice = this.constants.branchOfficesNational[1].value;
    this.claimRequestService.GetAddresClaim().subscribe({next: response => {
      this.address = response.address.trim();
      this.claimRequestDto.cellPhone = response.cellPhone;
      this.originalEmmail = response.email;
      this.claimRequestDto.email = response.email;
    }, error: _err => this.messageService.info('Datos Personales', _err)});
    this.claimRequestDto.address = this.address;
    this.parametersService.getByGroup(new ParameterDto({ group: 'LUGCWF' }))
      .subscribe({next: response =>
        this.claimDepartments = response, error: _err => this.messageService.info('Parámetros', _err.message)});
    this.parametersService.getByGroup(new ParameterDto({ group: 'PRO' }))
      .subscribe({next: response => {
        this.productTypes = response;
        this.productTypesSelected = this.productTypes[0];
        this.productCode = this.productTypesSelected.code;
        this.claimRequestDto.productName = this.productTypesSelected.description;
        this.claimRequestDto.productId = this.productTypesSelected.value;
        this.handleClaimType();
      }, error: _err => this.messageService.info('Parámetros', 'Por favor vuelva a intentarlo mas tarde.')});
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.claimRequestDto.approvers = $event.approvers;
    this.claimRequestDto.controllers = $event.controllers;
    this.claimRequestDto.cismartApprovers = $event.cismartApprovers;
  }

  handleAccountChanged($event: AccountResult) {
    this.claimRequestDto.sourceAccountId = $event.id;
    this.claimRequestDto.accountNumber = $event.formattedNumber;
    this.claimRequestDto.sourceAccount = $event.number;
    this.claimRequestDto.currency = $event.currency;
    this.sourceAccount = $event;
  }

  getChecking($event: any) {
    this.isVisibleEmails = $event == 3 ? true : false;
    this.claimRequestDto.respondeType = $event;
    if (!this.isVisibleEmails) {
      this.emailConfirmation = undefined!;
    }
  }

  handleClaimType() {
    this.parameterDto.group = this.productCode;
    this.parameterDto.code = this.claimRequestDto.claimType;
    this.parametersService.getListByGroupAndCode(this.parameterDto)
      .subscribe({next: response => {
        this.claimTypes = response;
      }, error: _err => this.messageService.info('Parámetros', 'Por favor vuelva a intentarlo mas tarde.')});
  }

  handleClearClaimType() {
    this.showDate = false;
    this.showAmountCurrency = false;
    this.claimTypes = [];
    this.serviceValue = '';
  }

  handleChange($event: any) {
    this.productCode = $event.code;
    this.claimRequestDto.productName = $event.description;
    this.claimRequestDto.productId = $event.value;
    this.handleClearClaimType();
    this.handleClaimType();
  }

  handleChangeChecked($event: any, typeClaim: string) {
    this.handleClearClaimType();
    this.isChecked = $event.target.checked;
    this.claimRequestDto.claimType = typeClaim;
    this.handleClaimType();
  }

  handleChangeClaimType($event: any) {
    this.showDate = false;
    this.showAmountCurrency = false;
    const valueClaim = this.claimRequestDto.claimType.substring(0, 1);
    const codeCalim = $event.value + valueClaim;
    this.claimRequestDto.serviceId = $event.value;
    this.claimRequestDto.serviceName = $event.description;
    this.parameterDto.group = this.productCode;
    this.parameterDto.code = codeCalim;
    this.parametersService.getByGroupAndCode(this.parameterDto)
      .subscribe({next: response => {
        this.claimValue = response.value;
        if (this.claimValue.trim() === '1') {
          this.showDate = true;
        } else if (this.claimValue.trim() === '2') {
          this.showDate = true;
          this.showAmountCurrency = true;
        }
      }, error: _err => ('')});
  }

  handleChangeDP(event: any): void {
    this.showError = false;
    this.dateClaim.jsdate = event;
  }

  handleValidate(accountValidation: boolean, approversValidation: boolean, _approverLimitsValidation: boolean) {
    this.isValidEmail = false;
    if (this.claimRequestDto.respondeType == 0) {
      this.messageService.info("Nota.- ", "Debe seleccionar el tipo de envío de respuesta.");
      return;
    }
    this.messageService.validateAllFormFields(this.claimForm.form);
    if (this.isVisibleEmails) {
      if (this.claimRequestDto.email !== this.emailConfirmation) {
        this.isValidEmail = true;
      } else if (this.claimForm.valid && approversValidation && accountValidation) {
        this.isVisibleToken = true;
      }
    } else if (this.claimForm.valid && approversValidation && accountValidation) {
      this.isVisibleToken = true;
    }
  }

  validateAmounts() {
    if (this.utilsService.validateAmount(this.claimRequestDto.sourceCurrency, this.sourceAccount.availableBalance, this.claimRequestDto.currency, this.claimRequestDto.amount)) {
      this.excedeedAmount = true;
    } else if (this.claimRequestDto.amount > 0) {
      this.isVisibleToken = true;
    } else {
      this.validateAmount = true;
    }
  }

  handleSaveRequestClaim($event: TokenCredentials) {
    this.claimRequestDto.tokenCode = $event.code;
    this.claimRequestDto.tokenName = $event.name;
    this.claimRequestDto.claimType = this.claimRequestDto.claimType.substring(0, 3);
    this.claimRequestDto.amount = this.claimRequestDto.amountClaim;
    this.claimRequestDto.address = this.address + ' Nro. ' + (this.numberAddres === undefined ? '' : this.numberAddres);
    this.claimRequestDto.transactionDate = this.claimValue.trim() === '0' ? '' : moment(this.dateClaim.jsdate).format('YYYYMMDD');
    this.claimRequestDto.transactionTime = this.claimValue.trim() === '0' ? '' : moment(this.transactionTime, 'HH:mm A').format('HHmmA');
    if (this.claimRequestDto.email == undefined || this.claimRequestDto.email == null || this.claimRequestDto.email == '') {
      this.claimRequestDto.email = this.originalEmmail;
    }
    this.claimRequestService.SaveClaimRequest(this.claimRequestDto)
      .subscribe({next: (res: ProcessBatchResult) => {
        this.numProcesBatch = res.processBatchId;
        this.letterNumber = res.letterNumber;
        this.isRemoveModalVisible = true;
        this.isVisibleToken = false;
      }, error: _err => this.messageService.info('Reclamos', _err.message)});
  }

  handleTokenSubmit($event: TokenCredentials) {
    if ($event) {
      this.isVisibleToken = false;
      this.handleSaveRequestClaim($event);
    }
  }

  handleReturn() {
    this.isRemoveModalVisible = false;
    this.router.navigate(['/operations/claimRequest']);
  }
}
