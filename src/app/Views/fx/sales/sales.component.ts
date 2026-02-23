import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ParameterResult} from "../../../Services/parameters/models/parameter-result";
import {AccountInformation} from "../../../Services/mass-payments/Models/payment-ach/account-information";

import {SourceAccountsComponent} from "../../shared/cw-components/source-accounts/source-accounts.component";
import {FavoriteTransfersComponent} from "../../transfers/components/favorite-transfers/favorite-transfers.component";
import {InterbankAccountsComponent} from "../../transfers/components/interbank-accounts/interbank-accounts.component";
import {SearchAccountsComponent} from "../../transfers/components/search-accounts/search-accounts.component";
import {
  ApproversAndControllersComponent
} from "../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component";
import {NgForm} from "@angular/forms";
import {CurrencyAndAmountComponent} from '../../shared/cw-components/currency-and-amount/currency-and-amount.component';
import {VentaDto} from "../../../Models/venta-dto";
import {Constants} from "../../../Services/shared/enums/constants";

import {VoucherDto} from "../../../Services/vouchers/voucher-operation/models/voucher-dto";
import {UtilsService} from "../../../Services/shared/utils.service";
import {ParametersService} from "../../../Services/parameters/parameters.service";
import {UserService} from "../../../Services/users/user.service";
import {DBFDMonitorService} from "../../../Services/DBFDMonitor/dbfdmonitor.service";

import {
  PaymentAchSpreadsheetResult
} from "../../../Services/mass-payments/Models/payment-ach/payment-ach-spreadsheet-result";
import {DateFutureModel} from "../../../Services/shared/models/date-future-model";
import {CompanyStatus} from "../../../Models/company-status";
import {AccountTypes} from "../../../Services/shared/enums/account-types";
import {AccountUse} from "../../../Services/shared/enums/account-use";
import {ParameterDto} from "../../../Services/parameters/models/parameter-dto";
import {Roles} from '../../../Services/shared/enums/roles';
import {FxService} from "../../../Services/Fx/fx.service";
import {mensajes} from "../../../Models/Mensajes";
import {AppConfig} from "../../../app.config";
// @ts-ignore
import * as bootstrap from 'bootstrap';
import {Router} from "@angular/router";
import {CommonFxService} from "../../../Services/Fx/common-fx.service";
import {DateRangeModel, OptionsDateRange} from "../../shared/cw-components/date-range/date-range.component";
import {LimitsService} from "../../../Services/limits/limits.service";
import {CompanyLimitsResult} from "../../../Services/limits/models/company-limits-result";
import { Sales } from '../../../Models/sales';
import { PaymentAchData } from '../../../Services/mass-payments/Models/payment-ach/payment-ach-data';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { TransferData } from '../../../Services/transfers/models/transfer-data';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import moment from 'moment';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { UifDto } from '../../../Services/shared/models/uif-dto';


@Component({
  selector: 'app-sales',
  standalone: false,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  public amount!: any;
  public amountTypeChange!: any;
  public acountNumber!: string;
  public Sales!: Sales[];
  public dateInit!: string;
  public dateEnd!: string;
  public hoy!: string;
  public showFunds = false;
  public showMessageIsBlock = false;
  public transferType = '';
  public successfulTransferMessage: string = '';
  public isTransferSuccessful = false;
  public isTokenFormDisabled = false;
  public isVisibleToken = false;
  public excedeedAmount = false;
  public isDisabledForm = false;
  public isOwnerHasError = false;
  public processBatchNumber = 0;
  public scheduleOperation = false;
  public isAmountDisabled = false;
  public groupIndex: number = 0;
  public branchOffices: ParameterResult[] = [];
  public banks!: ParameterResult[];
  public transferDto: PaymentAchData = new PaymentAchData();
  public interbankAccountInformation: AccountInformation = new AccountInformation();
  public sourceAccount: AccountResult = new AccountResult();
  public approversDto: InputApprovers = new InputApprovers();
  public batchInformation: TransferData = new TransferData();
  public sourceAccountDto: AccountDto = new AccountDto();
  public targetAccountDto: AccountDto = new AccountDto();
  public targetAccountUSD: AccountDto = new AccountDto();
  public targetAccountBOL: AccountDto = new AccountDto();
  public messageMonitor: string = '';
  public currencies: ParameterResult[] = [];
  public currenciesAll: ParameterResult[] = [];
  @ViewChild('targetAccount') sourceAccountComponent!: SourceAccountsComponent;
  @ViewChild(FavoriteTransfersComponent) favoriteComponent!: FavoriteTransfersComponent;
  @ViewChild(forwardRef(() => InterbankAccountsComponent)) interbankAccountComponent!: InterbankAccountsComponent;
  @ViewChild(SearchAccountsComponent) searchAccountsComponent!: SearchAccountsComponent;
  @ViewChild(ApproversAndControllersComponent)
  public approversComponent!: ApproversAndControllersComponent;
  @ViewChild('fundsForm') fundsForm!: NgForm;
  @ViewChild(CurrencyAndAmountComponent) currencyUif!: CurrencyAndAmountComponent;
  requestDto: VoucherDto = new VoucherDto();
  public is_validbatchtoken!: boolean;
  public isPreSave = false;
  public messagePrePreparer = Constants.messagePrePreparer;
  public currencyAndAmountValidation!: boolean;
  public approversAndControllersValidation!: boolean;
  public approversLimitValidation!: boolean;
  public emailValidation!: boolean;
  public sourceAccountValidation!: boolean;
  public showModalPreSave = false;
  public showModalSetDate = false;
  public isValidateCurreny = false;
  public isValidateDest = false;
  public venta: VentaDto = new VentaDto();
  public currentUser: any;
  public banqueros: any;
  public permissionActions: boolean = false;
  public isChecked: boolean = false;
  public banqueroSelect: number = 0;
  public banqueroName: string = "";
  public fundSource: string;
  public fundDestination: string;
  public dateRange: DateRangeModel = new DateRangeModel();
  public optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false
  };
  public DateMin: Date = new Date();
  public showCompanyLimitsLink = true;
  public showCompanyLimits = false;

  constructor(private parametersService: ParametersService, private actionsService: FxService,
              private commonFx: CommonFxService, private utilsService: UtilsService,
              private config: AppConfig, private userService: UserService, private monitor: DBFDMonitorService,
              private router: Router) {
    this.successfulTransferMessage = Constants.successfulTransactionMessage;
    this.hoy = moment().format('YYYY-MM-DD');
    this.dateInit = moment().format('YYYY-MM-DD');
    this.dateEnd = this.dateInit;
    this.Sales = [];
    this.amount = null;
    this.amountTypeChange = null;
    this.acountNumber = "";
    this.currentUser = this.userService.getUserToken();
    this.banqueros = [];
    this.fundSource = "";
    this.fundDestination = "";
  }

  public async ngOnInit() {
    this.currentUser = this.userService.getUserToken();
    this.permissionActions = await this.commonFx.GetCompanyAutorizhed(this.currentUser.company_id, false);

    this.parametersService.getByGroupAndCode(new ParameterDto({group: 'RESUSD', code: 'USD'}))
      .subscribe({
        next: resp => {
          this.isValidateCurreny = resp.value == 'A' ? true : false;
        }
      });
    this.parametersService.getByGroupAndCode(new ParameterDto({group: 'TICKET', code: 'MDD'}))
      .subscribe({next: response => this.isValidateDest = response.value == 'A'});
    this.parametersService.getByGroup(new ParameterDto({group: 'MONEFE'}))
      .subscribe({
        next: resp => {
          this.currencies = this.currenciesAll = resp;
        }
      });

    this.userService.getValidateCurrentUser();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    this.batchInformation.isAch = false;
    this.sourceAccountDto = new AccountDto({
      operationTypeId: [OperationType.nationalTransfers],
      types: [String.fromCharCode(AccountTypes.passive)],
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator
    });
    this.targetAccountDto = this.targetAccountUSD = this.targetAccountBOL = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.nationalTransfers;
    this.branchOffices = this.utilsService.getBranchOffices();
    this.getIpAddres();
    this.getSales();
    this.GetBankers();
  }

  public async GetBankers() {
    try {
      this.banqueros.push(this.config.getConfig("Banquero"));
      this.banqueroSelect = this.banqueros[0].id;
      this.banqueroName = this.banqueros[0].name;
      this.selectBanquero();
    } catch (e) {
      this.commonFx.showMessage(mensajes['banqueroError']);
    }
  }

  public selectBanquero(): void {
    try {
      let banck = this.banqueros[0];
      this.batchInformation.targetAccountCurrency = banck.currency;
      this.batchInformation.destinationAccount = banck.accountNumber;
      this.venta.destinationAccount = banck.accountNumber;
      this.venta.targetAccountCurrency = banck.currency;
      this.venta.bsAccount = banck.accountNumber;
      this.batchInformation.beneficiary = banck.name;
    } catch (error) {
      this.venta.destinationAccount = null;
    }
  }


  public async getSales() {
    this.Sales = [];
    let response: any = await this.getListaProm();
    for (let resp of response) {
      let sales: Sales = new Sales();
      sales.dollarsById = resp.dollarsById;
      sales.processBatchId = resp.processBatchId;
      sales.companyId = resp.companyId;
      sales.name = resp.name;
      sales.sourceAccountSus = resp.sourceAccountSus;
      sales.amount = resp.amount;
      sales.exchange = resp.exchange;
      sales.balance = resp.balance;
      sales.startDate = this.commonFx.desformatearFecha(resp.startDate);
      sales.endDate = this.commonFx.desformatearFecha(resp.endDate);
      sales.state = resp.state;
      this.Sales.push(sales);
    }
  }

  private async getListaProm() {
    return new Promise((resolve, reject) => {
      let companyStatus = new CompanyStatus();
      companyStatus.Company = this.currentUser.company_id;
      companyStatus.Type = "0";
      this.actionsService.GetTransfer(companyStatus).subscribe((response: any) => {
        resolve(response);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public async getIpAddres(): Promise<void> {
    let resp: string = await this.commonFx.getIpAddres();
    this.batchInformation.ip = resp;
    this.venta.ip = resp;
  }


  public handleChangeSourceCurrency() {
    if (this.isValidateCurreny && this.batchInformation.sourceCurrency != undefined) {
      this.batchInformation.currency = this.batchInformation.sourceCurrency
      if (this.batchInformation.currency === 'BOL') {
        this.currencies = this.currenciesAll.filter(x => x.code == 'BOL');
      } else if (this.batchInformation.currency === 'USD') {
        this.currencies = this.currenciesAll.filter(x => x.code == 'USD');
      } else {
        this.batchInformation.currency = '';
        this.currencies = this.currenciesAll;
      }
    }
  }

  public handleSourceAccountChanged($event: AccountResult) {
    this.acountNumber = $event.formattedNumber;
    this.currencies = this.currenciesAll;
    this.venta.sourceAccount = $event.number;
    this.venta.sourceAccountId = $event.id.toString();
    this.venta.sourceCurrency = "USD";
    this.venta.operationTypeId = 49;
    this.venta.currency = "USD";
    this.approversDto = new InputApprovers({
      accountId: $event.id,
      operationTypeId: OperationType.nationalTransfers,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountNumber: $event.formattedNumber
    });
    this.batchInformation.sourceAccount = $event.number;
    this.batchInformation.sourceAccountId = $event.id;
    this.batchInformation.sourceCurrency = "USD";
    this.sourceAccount = $event;
    this.handleChangeSourceCurrency();
  }

  public handleDateFuture($event: DateFutureModel) {
    this.batchInformation.isScheduledProcess = $event.isDateFuture;
    this.batchInformation.scheduledProcess = $event.date;
    this.batchInformation.scheduledProcessString = $event.dateString;
    if ($event.isDateFuture) {
      this.validateAmounts();
    }
  }

  public handleApproversOrControllersChanged($event: ApproversAndControllers) {
    let select: ApproversAndControllers = $event;
    this.venta.approvers = select.approvers;
    this.venta.controllers = select.controllers;
    this.venta.cismartApprovers = select.cismartApprovers;
    this.batchInformation.controllers = $event.controllers;
    this.batchInformation.approvers = $event.approvers;
    this.batchInformation.cismartApprovers = $event.cismartApprovers;
  }

  public handleTokenSubmit($event: TokenCredentials) {
    if (!this.batchInformation.isPrePreparer) {
      this.venta.tokenCode = $event.code;
      this.venta.tokenName = $event.name;
      this.batchInformation.tokenCode = $event.code;
      this.batchInformation.tokenName = $event.name;
    }
    this.saveTransfer();
  }

  public changeAmount() {
    //let amount: number = this.calcularPreciso(Number(this.amount), Number(this.amountTypeChange));
    let amount: number = this.calcularPreciso(Number(this.amount), Number(this.currentUser.exchange_buy));
    this.batchInformation.currency = "";
    this.batchInformation.amount = Number(this.amount);
  }


  private calcularPreciso(amount: number, amountTypeChange: number, decimales = 2) {
    const factor = Math.pow(10, decimales);
    const amountEntero = Math.round(amount * factor);
    const amountTypeChangeEntero = Math.round(amountTypeChange * factor);
    const totalEntero = amountEntero * amountTypeChangeEntero;
    const total = totalEntero / Math.pow(factor, 2);
    return Math.round(total * factor) / factor;
  }

  public async handleValidate(currencyAndAmountValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, emailValidation: boolean, sourceAccountValidation: boolean, isBtnPresave: boolean) {
    if (!this.Valid()) {
      return;
    }
    if (approversAndControllersValidation == false) {
      this.commonFx.showMessage(mensajes['Autorizador'], 'snackbar-danger');
      return;
    }
    if (approversLimitValidation == false) {
      return;
    }
    this.currencyAndAmountValidation = currencyAndAmountValidation;
    this.approversAndControllersValidation = approversAndControllersValidation;
    this.approversLimitValidation = approversLimitValidation;
    this.emailValidation = emailValidation;
    this.sourceAccountValidation = sourceAccountValidation;
    this.showModalPreSave = isBtnPresave;
    this.validMonitor();
    this.showToken();
  }


  public validMonitor() {
    this.parametersService.getByGroup({group: 'MONITR', code: 'MONITR'}).subscribe({
      next: resp => {
        resp.forEach(e => {
          if (e.value.toString() === 'A') {
            this.superviceMonitor();
          }
        });
      }
    });
  }

  public superviceMonitor() {
    if (this.groupIndex === 3 || this.batchInformation.isAch) {
      this.transferDto = Object.assign(this.transferDto, this.batchInformation);
      this.transferDto.type = 2;
      this.transferDto.spreadsheet = [];
      this.transferDto.spreadsheet.push(new PaymentAchSpreadsheetResult({
        line: 1,
        targetAccount: this.interbankAccountInformation.number,
        beneficiary: this.interbankAccountInformation.beneficiary,
        branchOfficeId: +this.interbankAccountInformation.branchOffice,
        branchOfficeDescription: this.interbankAccountInformation.branchOfficeDescription,
        bankDescription: this.interbankAccountInformation.bankDescription,
        banksAchCode: this.interbankAccountInformation.bank,
        amount: this.batchInformation.amount,
        processMessage: this.messageMonitor
      }));
      this.monitor.superviceMonitor(this.transferDto)
        .subscribe({
          next: (resp: PaymentAchSpreadsheetResult[]) => {
            resp.forEach(element => {
              if (element.operationStatusId != 0) {
                this.batchInformation.operationStatusId = 14
                this.messageMonitor = element.processMessage
              }
            });
            this.transferDto.spreadsheet = resp;
          }
        })
    }
  }

  public handleIsPreparer($event: any) {
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
    this.isPreSave = false;
  }

  public async saveTransfer(): Promise<void> {
    // @ts-ignore
    this.dateInit = this.commonFx.formatDateToString(this.dateRange.dateInit);
    // @ts-ignore
    this.dateEnd = this.commonFx.formatDateToString(this.dateRange.dateEnd);
    this.venta.importe = this.amount;
    this.venta.amount = this.amount;
    this.venta.amountSus = '0';
    this.venta.fechaInicio = this.dateInit;
    this.venta.fechaFin = this.dateEnd;
    this.venta.tipoDeCambio = this.amountTypeChange;
    this.venta.account = this.acountNumber;
    this.venta.Terms = this.isChecked;
    this.venta.fundSource = this.fundSource;
    this.venta.fundDestination = this.fundDestination;
    if (this.Valid()) {
      try {
        let resp: any = await this.commonFx.saveSales(this.venta);
        if (typeof resp.processBatchId === 'number') {
          this.amount = null;
          this.amountTypeChange = null;
          this.dateInit = moment().format('YYYY-MM-DD');
          this.dateEnd = moment().format('YYYY-MM-DD');
          this.banqueroSelect = 0;
          this.isChecked = false;
          this.fundSource = "";
          this.fundDestination = "";
          this.processBatchNumber = resp.processBatchId;
          this.isVisibleToken = false;
          this.isTransferSuccessful = true;
          this.commonFx.showMessage(mensajes['Ok']);
        }
      } catch (e: any) {
        this.commonFx.showMessage(e.toString());
      }
    }
  }

  public handleAccept(_$event: any) {
    this.router.navigate(['fx/sales']);
  }

  public viewTerminos() {
    new bootstrap.Modal(document.querySelector('#terminos')).show();
  }

  public validateAmounts() {
    if (this.utilsService.validateAmount(this.sourceAccount.currency, +this.sourceAccount.availableBalance, this.batchInformation.currency, +this.batchInformation.amount)) {
      this.excedeedAmount = true;
    } else {
      this.validationCismart();
    }
  }

  public showToken() {
    this.getIpAddres();
    for (let i = 0; i < 1; i++) {
      this.batchInformation.uif[i] = new UifDto();
      this.batchInformation.uif[i].isSuspiciusUif = false;
      this.batchInformation.uif[i].trace = 'SIN TRACE';
      this.batchInformation.uif[i].numberQueryUIF = 0;
      this.batchInformation.uif[i].cumulus = 0;
      this.batchInformation.uif[i].causalTransaction = this.transferType;
      this.batchInformation.uif[i].typeTransaction = 'LAVA';
      this.batchInformation.uif[i].sourceFunds = this.batchInformation.fundSource;
      this.batchInformation.uif[i].destinationFunds = this.batchInformation.fundDestination;
      this.batchInformation.uif[i].branchOffice = '201204';
    }
    this.isVisibleToken = true;
  }

  public onClose($event: any) {
    this.showMessageIsBlock = $event;
  }

  public validationCismart() {
    this.approversComponent.validationCismart()
      .subscribe({
        next: res => {
          if (res && !this.batchInformation.isPrePreparer) {
            this.isVisibleToken = true;
          }
        }
      });
  }

  public onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked;
  }

  private Valid(): boolean {
    const validPattern = /^[a-zA-Z0-9\s]+$/;
    if (!this.dateRange.isValid) {
      this.commonFx.showMessage(mensajes['RangoFecha'], 'snackbar-danger');
      return false;
    }
    if (!this.fundSource || this.fundSource.trim().length <= 20 || !validPattern.test(this.fundSource)) {
      this.commonFx.showMessage(mensajes['fondoOrigen'], 'snackbar-danger');
      return false;
    }
    if (!this.fundDestination || this.fundDestination.trim().length <= 20 || !validPattern.test(this.fundDestination)) {
      this.commonFx.showMessage(mensajes['fondoDestino'], 'snackbar-danger');
      return false;
    }
    if (!this.isChecked) {
      this.commonFx.showMessage(mensajes['ValidatTerminos'], 'snackbar-danger');
      return false;
    }
    if (this.venta.destinationAccount == null) {
      this.commonFx.showMessage(mensajes['banquero'], 'snackbar-danger');
      return false;
    }
    if (moment(this.dateEnd).isBefore(this.dateInit)) {
      this.commonFx.showMessage(mensajes['Rango_fechas'], 'snackbar-danger');
      return false;
    }
    if (this.acountNumber === "") {
      this.commonFx.showMessage(mensajes['Cuentas'], 'snackbar-danger');
      return false;
    }
    if (!this.commonFx.isValidNumber(this.amount, mensajes['Monto'])) {
      return false;
    }
    if (!this.commonFx.isValidNumber(this.amountTypeChange, mensajes['Cambio'])) {
      return false;
    }
    return true;
  }
}
