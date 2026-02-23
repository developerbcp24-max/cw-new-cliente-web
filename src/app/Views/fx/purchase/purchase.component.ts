import {Component, forwardRef, OnInit, ViewChild} from '@angular/core';
import {AccountDto} from '../../../Services/accounts/models/account-dto';
import {ApproversAndControllers} from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import {InputApprovers} from '../../../Services/approvers-and-controllers/models/input-approvers';
import {AccountResult} from '../../../Services/balances-and-movements/models/account-result';
import {AccountInformation} from '../../../Services/mass-payments/Models/payment-ach/account-information';
import {PaymentAchData} from '../../../Services/mass-payments/Models/payment-ach/payment-ach-data';
import {
  PaymentAchSpreadsheetResult
} from '../../../Services/mass-payments/Models/payment-ach/payment-ach-spreadsheet-result';
import {ParameterResult} from '../../../Services/parameters/models/parameter-result';
import {AccountTypes} from '../../../Services/shared/enums/account-types';
import {AccountUse} from '../../../Services/shared/enums/account-use';
import {Constants} from '../../../Services/shared/enums/constants';
import {OperationType} from '../../../Services/shared/enums/operation-type';
import {Roles} from '../../../Services/shared/enums/roles';
import {DateFutureModel} from '../../../Services/shared/models/date-future-model';
import {UtilsService} from '../../../Services/shared/utils.service';
import {TokenCredentials} from '../../../Services/tokens/models/token-credentials';
import {
  ApproversAndControllersComponent
} from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import {SourceAccountsComponent} from '../../shared/cw-components/source-accounts/source-accounts.component';
import {TransferData} from './../../../Services/transfers/models/transfer-data';
import {AccountOwnerResult} from '../../../Services/accounts/models/account-owner-result';
import {ParametersService} from '../../../Services/parameters/parameters.service';
import {NgForm} from '@angular/forms';
import {UifDto} from '../../../Services/shared/models/uif-dto';
import {VoucherDto} from '../../../Services/vouchers/voucher-operation/models/voucher-dto';
import {CurrencyAndAmountComponent} from '../../shared/cw-components/currency-and-amount/currency-and-amount.component';
import {lastValueFrom} from 'rxjs';
import moment from "moment";
import {Sales} from "../../../Models/sales";
import {FavoriteTransfersComponent} from "../../transfers/components/favorite-transfers/favorite-transfers.component";
import {SearchAccountsComponent} from "../../transfers/components/search-accounts/search-accounts.component";
import {InterbankAccountsComponent} from "../../transfers/components/interbank-accounts/interbank-accounts.component";
import {VentaDto} from "../../../Models/venta-dto";
import {FxService} from "../../../Services/Fx/fx.service";
import {AppConfig} from "../../../app.config";
// @ts-ignore
import * as bootstrap from 'bootstrap';
import {mensajes} from "../../../Models/Mensajes";
import {Router} from "@angular/router";
import {CommonFxService} from "../../../Services/Fx/common-fx.service";
import {CompanyLimitsResult} from "../../../Services/limits/models/company-limits-result";
import { DBFDMonitorService } from '../../../Services/DBFDMonitor/dbfdmonitor.service';
import { UserService } from '../../../Services/users/user.service';
import { ParameterDto } from '../../../Services/parameters/models/parameter-dto';


@Component({
  selector: 'app-purchase',
  standalone: false,
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  public amount!: any;
  public amountTypeChange!: string;
  public acountNumber!: string;

  public dateInit!: string;
  public dateEnd!: string;
  public hoy!: string;
  public showFunds = false;
  public showMessageIsBlock = false;
  public transferType = '';
  public successfulTransferMessage: string;
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
  public showModalPreSave: boolean = false;
  public showModalSetDate: boolean = false;
  public onlyCurrencyBOL: boolean = false;
  public isValidateCurreny: boolean = false;
  public isValidateDest: boolean = false;
  public acordeon: number = -1;
  public dollarsById: number;
  public companyId: number;
  public currentUser: any;
  public ComicionConfianzaValue: number = 0;
  public venta: VentaDto = new VentaDto();
  public permissionActions: boolean = false;
  public isChecked: boolean = false;
  public fundSource: string;
  public fundDestination: string;
  public Sales!: Sales[];
  public paginatedData: Sales[] = [];
  public pageSize: number = 10;
  public currentPage: number = 1;
  public comisionConfianzaValue: number = 0;
  public showCompanyLimitsLink = true;
  public showCompanyLimits = false;
  public amountBs: number;

  get totalPages(): number {
    return Math.ceil(this.Sales.length / this.pageSize);
  }

  constructor(private parametersService: ParametersService, private actionsService: FxService, private commonFx: CommonFxService,
              private config: AppConfig, private utilsService: UtilsService, private userService: UserService,
              private monitor: DBFDMonitorService, private router: Router) {
    this.successfulTransferMessage = Constants.successfulTransactionMessage;
    this.hoy = moment().format('YYYY-MM-DD');
    this.dateInit = moment().format('YYYY-MM-DD');
    this.dateEnd = this.dateInit;
    this.Sales = [];
    this.amount = null;
    this.amountTypeChange = '';
    this.acountNumber = "";
    this.dollarsById = 0;
    this.companyId = 0;
    this.currentUser = this.userService.getUserToken();
    this.fundSource = "";
    this.fundDestination = "";
    this.amountBs = 0;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = this.userService.getUserToken();
    this.permissionActions = await this.commonFx.GetCompanyAutorizhed(this.currentUser.company_id, true);
    this.parametersService.getByGroupAndCode(new ParameterDto({group: 'RESUSD', code: 'USD'})).subscribe({
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
  }

  public getPosentaje() {
    return this.commonFx.toPercentage(this.comisionConfianzaValue ?? 0.05)
  }

  public ComicionConfianza(montoVenta: number): void {
    if (this.amount > montoVenta) {
      this.amount = montoVenta;
      this.commonFx.showMessage(mensajes['MontoValid'], 'snackbar-danger');
    }
    let comin: number = this.comisionConfianzaValue ?? 0.05;
    let m: number = this.amount * Number(this.currentUser.exchange_sale);
    this.ComicionConfianzaValue = (m * comin);
    this.amountBs = this.calcularPreciso(Number(this.amount), Number(this.amountTypeChange));
    this.batchInformation.amount = (Number(this.amount) * Number(this.amountTypeChange)) / Number(this.currentUser.exchange_buy);
    this.batchInformation.currency = "";
  }

  private calcularPreciso(amount: number, amountTypeChange: number, decimales = 2) {
    const factor = Math.pow(10, decimales);
    const amountEntero = Math.round(amount * factor);
    const amountTypeChangeEntero = Math.round(amountTypeChange * factor);
    const totalEntero = amountEntero * amountTypeChangeEntero;
    const total = totalEntero / Math.pow(factor, 2);
    return Math.round(total * factor) / factor;
  }

  public async getSales(): Promise<void> {
    this.Sales = [];
    let response: any = await this.getListaProm();
    for (let resp of response) {
      let sales: Sales = new Sales();
      sales.id = resp.idOffer;
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
      sales.commission = resp.commission;
      this.Sales.push(sales);
    }
    this.updatePaginatedData(this.currentPage);
  }

  public updatePaginatedData(page: number): void {
    const startIndex: number = (page - 1) * this.pageSize;
    const endIndex: number = startIndex + this.pageSize;
    this.paginatedData = this.Sales.slice(startIndex, endIndex);
  }

  public previousPage(): void {
    this.acordeon = -1;
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData(this.currentPage);
    }
  }

  public nextPage(): void {
    this.acordeon = -1;
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData(this.currentPage);
    }
  }

  public changePage(page: number): void {
    this.acordeon = -1;
    this.currentPage = page;
    this.updatePaginatedData(this.currentPage);
  }

  public getPageNumbers(): number[] {
    const totalPages: number = this.totalPages;
    const currentPage: number = this.currentPage;
    const range: number = 2;
    let start: number = Math.max(1, currentPage - range);
    let end: number = Math.min(totalPages, currentPage + range);
    if (currentPage - range <= 1) {
      end = Math.min(totalPages, range * 2 + 1);
    }
    if (currentPage + range >= totalPages) {
      start = Math.max(1, totalPages - range * 2);
    }
    return Array.from({length: end - start + 1}, (_: unknown, i: number): number => start + i);
  }


  private async getListaProm(): Promise<any> {
    try {
      const companyStatus = {
        Company: Number(this.currentUser.company_id),
        Type: "ALL"
      };
      return await lastValueFrom(this.actionsService.GetTransfer(companyStatus));
    } catch (error) {
      this.commonFx.showMessage('No se pudo obtener la lista de ofertas');
      throw new Error('No se pudo obtener la lista de transferencias');
    }
  }

  public async getIpAddres(): Promise<void> {
    let resp: string = await this.commonFx.getIpAddres();
    this.batchInformation.ip = resp;
    this.venta.ip = resp;
  }

  public handleSourceAccountChanged($event: AccountResult) {
    this.acountNumber = $event.formattedNumber;
    this.currencies = this.currenciesAll;
    this.venta.sourceAccount = $event.formattedNumber;
    this.venta.sourceAccountId = $event.id.toString();
    this.venta.sourceCurrency = $event.currency;
    this.venta.operationTypeId = 49;
    this.approversDto = new InputApprovers({
      accountId: $event.id,
      operationTypeId: OperationType.nationalTransfers,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountNumber: $event.formattedNumber
    });
    this.batchInformation.sourceAccount = $event.number;
    this.batchInformation.sourceAccountId = $event.id;
    this.batchInformation.sourceCurrency = $event.currency;
    this.sourceAccount = $event;
    this.handleChangeSourceCurrency();
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

  public handleDestinationAccountChanged($event: AccountOwnerResult) {
    this.isOwnerHasError = $event.isOwnerHasError;
    if (!this.isOwnerHasError && $event.currency) {
      this.batchInformation.targetAccountCurrency = $event.currency;
      this.batchInformation.destinationAccount = $event.formattedNumber;
      this.venta.destinationAccount = $event.formattedNumber;
      this.venta.targetAccountCurrency = $event.currency;
      this.venta.bsAccount = $event.formattedNumber;
    }
    this.batchInformation.beneficiary = $event.owner;
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
    this.batchInformation.controllers = select.controllers;
    this.batchInformation.approvers = select.approvers;
    this.batchInformation.cismartApprovers = select.cismartApprovers;
  }

  public handleTokenSubmit($event: TokenCredentials) {
    this.venta.tokenCode = $event.code;
    this.venta.tokenName = $event.name;
    if (!this.batchInformation.isPrePreparer) {
      this.batchInformation.tokenCode = $event.code;
      this.batchInformation.tokenName = $event.name;
    }
    this.saveTransfer();
  }

  public async handleValidate(currencyAndAmountValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, emailValidation: boolean, sourceAccountValidation: boolean, isBtnPresave: boolean) {
    if (approversLimitValidation == false) {
      return;
    }
    if (approversAndControllersValidation == false) {
      this.commonFx.showMessage(mensajes['Autorizador'], 'snackbar-danger');
      return;
    }
    if (!this.Valid()) {
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
    this.validateAmounts();
  }

  public validMonitor() {
    this.parametersService.getByGroup({group: 'MONITR', code: 'MONITR'})
      .subscribe({
        next: resp => {
          resp.forEach(e => {
            if (e.value.toString() === 'A') {
              this.superviceMonitor();
            }
          });
        }
      })
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

  public async saveTransfer() {
    this.venta.importe = this.amountBs.toString();
    this.venta.amount = this.amountBs.toString();
    this.venta.amountSus = this.amount;
    this.venta.fechaInicio = this.dateInit;
    this.venta.fechaFin = this.dateEnd;
    this.venta.account = this.acountNumber;
    this.venta.dollarBuyId = this.dollarsById;
    this.venta.dollarSellId = this.dollarsById;
    this.venta.companyId = this.companyId;
    this.venta.tipoDeCambio = this.amountTypeChange;
    this.venta.operationTypeId = 48;
    this.venta.Terms = this.isChecked;
    this.venta.fundSource = this.fundSource;
    this.venta.fundDestination = this.fundDestination;
    if (this.Valid()) {
      try {
        let resp: any = await this.commonFx.saveSales(this.venta);
        if (typeof resp.processBatchId === 'number') {
          this.processBatchNumber = resp.processBatchId;
          this.isVisibleToken = false;
          this.isTransferSuccessful = true;
          this.amount = null;
          this.venta.amountSus = '';
          this.dateInit = moment().format('YYYY-MM-DD');
          this.dateEnd = moment().format('YYYY-MM-DD');
          this.fundSource = "";
          this.fundDestination = "";
          this.commonFx.showMessage(mensajes['Ok']);
        }
      } catch (e: any) {
        this.commonFx.showMessage(e.toString(), 'snackbar-danger');
      }
    }
  }

  public handleAccept(_$event: any) {
    this.router.navigate(['fx/purchase']);
  }

  public onCheckboxChange(event: Event) {
    const checkbox: HTMLInputElement = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked;
  }

  public viewTerminos() {
    new bootstrap.Modal(document.querySelector('#terminosCompra')).show();
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
    for (let i: number = 0; i < 1; i++) {
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

  private Valid(): boolean {
    const validPattern = /^[a-zA-Z0-9\s]+$/;
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

  public changeSelect(i: number, amountTypeChange: number, companyId: number, dollarsById: number, comicion: number = 1): void {
    this.amount = 0;
    this.amountBs = 0;
    this.acordeon = i;
    this.amountTypeChange = amountTypeChange.toString();
    this.dollarsById = dollarsById;
    this.companyId = companyId;
    this.comisionConfianzaValue = (comicion / 100);
    this.ComicionConfianza(0);
  }

  public number(value: any): number {
    return Number(value);
  }
}
