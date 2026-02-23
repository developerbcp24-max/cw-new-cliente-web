import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { GlobalService } from '../../../Services/shared/global.service';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { MultiplePaymentsService } from '../../../Services/mass-payments/multiple-payments-service.service';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { UtilsService } from '../../../Services/shared/utils.service';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { Constants } from '../../../Services/shared/enums/constants';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { NgForm } from '@angular/forms';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { MultiplePaymentsData } from '../../../Services/mass-payments/Models/multiple-payments/multiple-payments-data';
import { MultiplePaymentSpreadsheetsResult } from '../../../Services/mass-payments/Models/multiple-payments/multiple-payment-spreadsheets-result';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { UserService } from '../../../Services/users/user.service';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { UifcwResult } from '../../../Services/uif/models/uifcw-result';
import { HeaderDetailComponent } from '../components/header-detail/header-detail.component';
import { UifService } from '../../../Services/uif/uif.service';
import { IpAddresService } from '../../../Services/users/ip-addres.service';
import { catchError } from 'rxjs';
import { DBFDMonitorService } from '../../../Services/DBFDMonitor/dbfdmonitor.service';
import { ParametersService } from '../../../Services/parameters/parameters.service';

@Component({
  selector: 'app-multiple-payments',
  standalone: false,
  templateUrl: './multiple-payments.component.html',
  styleUrls: ['./multiple-payments.component.css'],
  providers: [TicketsService, MultiplePaymentsService, UtilsService, UifService, ParametersService],
})
export class MultiplePaymentsComponent implements OnInit {

  isValidFunds = false;
  showFunds = false;
  showTokenForm = false;
  excedeedAmount = false;
  showRemoveFavoriteForm = false;
  scheduleOperation = false;
  showGlossForm = false;
  showFavoriteForm = false;
  isTransactionSuccessful = false;
  validateAmount = false;
  haveErrorsHab = false;
  haveErrorsProv = false;
  haveOldPayments = true;
  validateProdem = false;
  accountAvailableBalance!: number;
  selectedFavoriteTransaction!: number;
  itemsPerPageHab = 10;
  itemsPerPageProv = 10;
  itemsPerPageEfe = 10;
  itemsPerPageAch = 10;
  totalHABPayments = 0;
  totalPROVPayments = 0;
  totalEFEPayments = 0;
  totalACHPayments = 0;
  rowsPerPageHab: number[] = [10, 15, 20, 25];
  rowsPerPageProv: number[] = [10, 15, 20, 25];
  rowsPerPageEfe: number[] = [10, 15, 20, 25];
  rowsPerPageAch: number[] = [10, 15, 20, 25];
  spreadsheetSizeHab!: number;
  spreadsheetSizeProv!: number;
  spreadsheetSizeEfe!: number;
  spreadsheetSizeAch!: number;
  processBatchNumber!: number;
  globalGloss!: string;
  isVisibleHab!: boolean;
  isVisibleProv!: boolean;
  isVisibleEfe!: boolean;
  isVisibleAch!: boolean;
  isValidSpreadSheet: boolean;
  warningMessagesTitle = 'Pagos Multiples ';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto: AccountDto;
  spreadsheetPerPageHab!: MultiplePaymentSpreadsheetsResult[];
  spreadsheetPerPageProv!: MultiplePaymentSpreadsheetsResult[];
  spreadsheetPerPageEfe!: MultiplePaymentSpreadsheetsResult[];
  spreadsheetPerPageAch!: MultiplePaymentSpreadsheetsResult[];
  currentPageHab!: number;
  currentPageProv!: number;
  currentPageEfe!: number;
  currentPageAch!: number;
  batchInformation: MultiplePaymentsData = new MultiplePaymentsData();
  authorizersDto!: InputApprovers;
  glossType!: string;
  previousSpreadsheets!: MassivePaymentsPreviousFormResult[];
  amounts: number[] = [];
  amount!: number;
  isAuthorizeOperation: boolean;
  amountHAB!: number;
  amountPROV!: number;
  amountEFE!: number;
  amountACH!: number;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild('globalGlossForm') globalGlossForm!: NgForm;
  @ViewChild(HeaderDetailComponent) headerUif!: HeaderDetailComponent;
  isPreSave = false;
  sourceAccount: AccountResult = new AccountResult();
  uifcwResult: UifcwResult[] = [];
  saleExchangeRate!: number;
  is_validbatchtoken!: boolean;
  messagePrePreparer = Constants.messagePrePreparer;
  showMessageIsBlock = false;

  headerValidation!: boolean;
  approversValidation!: boolean;
  approverLimitsValidation!: boolean;
  emailsValidation!: boolean;
  showModalPreSave = false;
  showModalSetDate = false;
  isScheduledProcess = false;

  constructor(private ipEnc: IpAddresService, private multiplePaymentService: MultiplePaymentsService, private globalService: GlobalService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private userService: UserService, private monitor: DBFDMonitorService, private uifService: UifService, private paramService: ParametersService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoMultiple],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.pagoMultiple;
    this.isValidSpreadSheet = false;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;
    localStorage.setItem('operationType', OperationType.pagoMultiple.toString());
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    this.getIpAddres();
  }
  async getIpAddres(){
    try {
      const ip = await this.ipEnc.getClientIp();
      this.batchInformation.ip  = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.batchInformation.ip = 'NOT_IP';
    }
   /*  this.ipEnc.getIpClient().pipe(
      catchError(_err => this.ipEnc.getIpAddress())
    ).subscribe({next: response => {
      this.batchInformation.ip = response.ip;
    }, error: _err => {
      this.batchInformation.ip ='NOT_IP';
    }}); */

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleAccountChanged($event: AccountResult) {
    this.authorizersDto = new InputApprovers({
      operationTypeId: OperationType.pagoMultiple,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      accountNumber: $event.formattedNumber
    });
    this.sourceAccount = $event;
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.batchInformation.approvers = $event.approvers;
    this.batchInformation.controllers = $event.controllers;
    this.batchInformation.cismartApprovers = $event.cismartApprovers;
  }

  handlePageChangedHab(pageNumber: number) {
    this.currentPageHab = pageNumber;
    this.spreadsheetPerPageHab = this.batchInformation.spreadsheet.formSalariesPayments.slice((this.currentPageHab - 1) * this.itemsPerPageHab, this.itemsPerPageHab * this.currentPageHab);
  }

  handlePageChangedProv(pageNumber: number) {
    this.currentPageProv = pageNumber;
    this.spreadsheetPerPageProv = this.batchInformation.spreadsheet.formProvidersPayments.slice((this.currentPageProv - 1) * this.itemsPerPageProv, this.itemsPerPageProv * this.currentPageProv);
  }

  handlePageChangedEfe(pageNumber: number) {
    this.currentPageEfe = pageNumber;
    this.spreadsheetPerPageEfe = this.batchInformation.spreadsheet.formCashPayments.slice((this.currentPageEfe - 1) * this.itemsPerPageEfe, this.itemsPerPageEfe * this.currentPageEfe);
  }

  handlePageChangedAch(pageNumber: number) {
    this.currentPageAch = pageNumber;
    this.spreadsheetPerPageAch = this.batchInformation.spreadsheet.formAchPayments.slice((this.currentPageAch - 1) * this.itemsPerPageAch, this.itemsPerPageAch * this.currentPageAch);
  }

  getPreviousSpreadsheets() {
    this.multiplePaymentService.getPreviousSpreadsheets()
      .subscribe({next: response => this.previousSpreadsheets = response,
        error: _err => this.haveOldPayments = false});
  }

  updateBatchAmount(): void {
    this.amountHAB = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formSalariesPayments);
    this.haveErrorsHab = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.isError).length > 0 ? true : false;
    this.totalHABPayments = this.batchInformation.spreadsheet.formSalariesPayments.length;
    this.amountPROV = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formProvidersPayments);
    this.haveErrorsProv = this.batchInformation.spreadsheet.formProvidersPayments.filter(x => x.isError).length > 0 ? true : false;
    this.totalPROVPayments = this.batchInformation.spreadsheet.formProvidersPayments.length;
    this.amountEFE = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formCashPayments);
    this.totalEFEPayments = this.batchInformation.spreadsheet.formCashPayments.length;
    this.amountACH = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formAchPayments);
    this.totalACHPayments = this.batchInformation.spreadsheet.formAchPayments.length;
    if (this.isAuthorizeOperation) {
      this.amounts = this.batchInformation.spreadsheet.formSalariesPayments.map(x => +x.amount)
        .concat(this.batchInformation.spreadsheet.formProvidersPayments.map(x => +x.amount)
          .concat(this.batchInformation.spreadsheet.formCashPayments.map(x => x.amount)
            .concat(this.batchInformation.spreadsheet.formAchPayments.map(x => x.amount))));
    } else {
      this.amount = this.amountHAB + this.amountPROV + this.amountEFE + this.amountACH;
    }
    this.batchInformation.amount = this.amountHAB + this.amountPROV + this.amountEFE + this.amountACH;
    if (this.batchInformation.amount <= 0) {
      this.validateAmount = true;
    } else {
      this.validateAmount = false;
    }
  }

  handleSelectSpreadsheetId($event: MassivePaymentsPreviousFormResult) {
    this.multiplePaymentService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleGroupChanged($event: number) {
    if ($event === 2) {
      this.getPreviousSpreadsheets();
    }
  }

  handleViewRowsHab($event: string) {
    this.itemsPerPageHab = +$event;
    this.handlePageChangedHab(0);
  }

  handleViewRowsProv($event: string) {
    this.itemsPerPageProv = +$event;
    this.handlePageChangedProv(0);
  }

  handleViewRowsEfe($event: string) {
    this.itemsPerPageEfe = +$event;
    this.handlePageChangedEfe(0);
  }

  handleViewRowsAch($event: string) {
    this.itemsPerPageAch = +$event;
    this.handlePageChangedAch(0);
  }

  handleAssignGlobalGloss() {
    this.globalService.validateAllFormFields(this.globalGlossForm.form);
    if (this.globalGlossForm.valid) {
      if (this.glossType === 'HAB') {
        this.batchInformation.spreadsheet.formSalariesPayments.forEach(x => x.glossPayment = this.globalGloss);
      }
      if (this.glossType === 'PROV') {
        this.batchInformation.spreadsheet.formProvidersPayments.forEach(x => x.glossPayment = this.globalGloss);
      }
      this.showGlossForm = false;
      this.globalGloss = undefined!;
    }
  }

  handleLoadFile($event: FormData) {
    this.multiplePaymentService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: MultiplePaymentSpreadsheetsResult[]) {
    this.batchInformation.spreadsheet.formSalariesPayments = spreadsheet.filter(x => x.paymentType === 'HAB');
    this.batchInformation.spreadsheet.formProvidersPayments = spreadsheet.filter(x => x.paymentType === 'PROV');
    this.batchInformation.spreadsheet.formCashPayments = spreadsheet.filter(x => x.paymentType === 'EFE');
    this.batchInformation.spreadsheet.formAchPayments = spreadsheet.filter(x => x.paymentType === 'ACH');
    this.updateBatchAmount();
    this.spreadsheetSizeHab = this.batchInformation.spreadsheet.formSalariesPayments.length;
    this.spreadsheetSizeProv = this.batchInformation.spreadsheet.formProvidersPayments.length;
    this.spreadsheetSizeEfe = this.batchInformation.spreadsheet.formCashPayments.length;
    this.spreadsheetSizeAch = this.batchInformation.spreadsheet.formAchPayments.length;
    this.isVisibleHab = this.spreadsheetSizeHab > 0 ? true : false;
    this.isVisibleProv = this.spreadsheetSizeProv > 0 ? true : false;
    this.isVisibleEfe = this.spreadsheetSizeEfe > 0 ? true : false;
    this.isVisibleAch = this.spreadsheetSizeAch > 0 ? true : false;
    this.handlePageChangedHab(this.currentPageHab);
    this.handlePageChangedProv(this.currentPageProv);
    this.handlePageChangedEfe(this.currentPageEfe);
    this.handlePageChangedAch(this.currentPageAch);
    if (spreadsheet.filter(x => x.isError).length === 0) {
      this.isValidSpreadSheet = true;
    } else {
      this.isValidSpreadSheet = false;
    }
  }

  handleValidateUif() {
    if (this.headerValidation && this.approversValidation && this.approverLimitsValidation && this.emailsValidation && this.isValidSpreadSheet) {
      this.isPreSave = this.showModalPreSave;
      this.batchInformation.isPrePreparer = this.isPreSave ? true : false;
      if (!this.utilsService.validateProdem(this.batchInformation.currency, this.batchInformation.spreadsheet.formAchPayments)) {
        this.validateProdem = false;
        if (!this.batchInformation.isTicket) {
          this.validateAmounts();
        } else {
          this.validateGMESATicket();
        }
      } else {
        this.validateProdem = true;
      }
      return true;
    } else {
      return false;
    }
  }

  handleValidate(headerValidation: boolean, approversValidation: boolean, approverLimitsValidation: boolean, emailsValidation: boolean, isBtnPresave: boolean) {
    this.headerValidation = headerValidation;
    this.approversValidation = approversValidation;
    this.approverLimitsValidation = approverLimitsValidation;
    this.emailsValidation = emailsValidation;
    this.showModalPreSave = isBtnPresave;
    this.isScheduledProcess = this.scheduleOperation = false;
    this.validMonitor();
    this.showToken();
  }
  validMonitor(){
    this.paramService.getByGroup({group: 'MONITR', code: 'MONITR'})
    .subscribe({next: resp => {
      resp.forEach(e => {
        if(e.value.toString()==='A'){
          this.superviceMonitor();
        }
      });
    }})
  }

superviceMonitor(){
    this.monitor.superviceMonitorMultiple(this.batchInformation)
    .subscribe({next: (resp: MultiplePaymentSpreadsheetsResult[]) => {
      resp.forEach(element => {
        if(element.operationSatatusId!=0){
          this.batchInformation.operationStatusId=14;
        }
      });
      this.batchInformation.spreadsheet.formAchPayments=resp;
    }})
  }
  handleIsPreparer($event: any) {
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
    this.isPreSave = false;
  }

  handleValidateSetDate() {
    if (this.headerValidation && this.approversValidation && this.approverLimitsValidation && this.emailsValidation && this.isValidSpreadSheet) {
      if (this.batchInformation.amount > 0) {
        this.scheduleOperation = true;
      } else {
        this.validateAmount = true;
      }
    }
  }

  handleValidateForScheduleOperation(headerValidation: boolean, approversValidation: boolean, approverLimitsValidation: boolean, emailsValidation: boolean, isSetDate: boolean) {
    this.headerValidation = headerValidation;
    this.approversValidation = approversValidation;
    this.approverLimitsValidation = approverLimitsValidation;
    this.emailsValidation = emailsValidation;
    this.isScheduledProcess = isSetDate;
    this.batchInformation.isPrePreparer = this.isPreSave = this.showModalPreSave = false;
    this.validMonitor();
    this.showToken();
  }

  handleDateFuture($event: DateFutureModel) {
    this.batchInformation.isScheduledProcess = $event.isDateFuture;
    this.batchInformation.scheduledProcess = $event.date;
    this.batchInformation.scheduledProcessString = $event.dateString;
    if ($event.isDateFuture) {
      this.validateAmounts();
    }
  }

  handleRowChanged() {
    this.updateSpreadsheet(this.batchInformation.spreadsheet.formSalariesPayments.concat(this.batchInformation.spreadsheet.formProvidersPayments)
      .concat(this.batchInformation.spreadsheet.formCashPayments).concat(this.batchInformation.spreadsheet.formAchPayments));
  }

  validateAmounts() {
    if (this.utilsService.validateAmount(this.batchInformation.sourceCurrency, this.sourceAccount.availableBalance, this.batchInformation.currency, this.batchInformation.amount)) {
      this.excedeedAmount = true;
      this.isPreSave = false;
    } else if (this.batchInformation.amount > 0) {
      if (!this.batchInformation.isPrePreparer) {
        this.validationCismart();
      }
    } else {
      this.batchInformation.isPrePreparer = this.isPreSave = false;
      this.validateAmount = true;
    }
  }

  validateGMESATicket() {
    this.ticketsService.verifyGMESATicket(new TicketDto({ destinationCurrency: this.batchInformation.currency, sourceCurrency: this.batchInformation.sourceCurrency, number: this.batchInformation.numberTicket, amount: this.batchInformation.amount }))
      .subscribe({next: response => {
        if (response.isValid) {
          this.batchInformation.preferentialExchange = response.exchangeRate;
          this.batchInformation.indicatorBuyOrSale = response.operationType;
          if (!this.batchInformation.isPrePreparer) {
            this.validationCismart();
          }
        } else {
          this.globalService.warning('Ticket preferencial incorrecto, ', response.errorMessage, true);
        }
      }, error: _err => this.globalService.warning('Servicio mesa de dinero', _err.message)});
  }

  showToken() {
    this.getIpAddres();
    this.uifService.validateOriginDestinationUif(this.batchInformation)
    .subscribe({next: (_res) => {
      this.saleExchangeRate = this.utilsService.saleExchangeRate;
      let amounts: Array<any> = new Array<any>();
      if (this.amountHAB > 0) { amounts.push({amount:this.amountHAB,causal:'PGPDH'}); }
      if (this.amountPROV > 0) { amounts.push({amount:this.amountPROV,causal:'PGPRO'}); }
      if (this.amountEFE > 0) { amounts.push({amount:this.amountEFE,causal:'GIROS'}); }
      if (this.amountACH > 0) { amounts.push({amount:this.amountACH,causal:'TRACH'}); }
          for (let i = 0; amounts.length > i; i++) {
            this.batchInformation.uif[i] = new UifDto();
            this.batchInformation.uif[i].amount = amounts[i].amount;
            this.batchInformation.uif[i].isSuspiciusUif = false;
            this.batchInformation.uif[i].trace = 'SIN TRACE ' + [i];
            this.batchInformation.uif[i].numberQueryUIF = 0;
            this.batchInformation.uif[i].cumulus = 0;
            this.batchInformation.uif[i].causalTransaction = amounts[i].causal;
            this.batchInformation.uif[i].typeTransaction = 'LAVA';
            this.batchInformation.uif[i].sourceFunds = this.batchInformation.fundSource;
            this.batchInformation.uif[i].destinationFunds = this.batchInformation.fundDestination;
            this.batchInformation.uif[i].branchOffice = '201204';
            this.batchInformation.uif[i].isMultiple = true;
          }
          if (!this.batchInformation.isValidUif) {
            if (this.isScheduledProcess) {
              this.handleValidateSetDate();
            } else {
              this.handleValidateUif();
            }
          }
        }});
  }

  isShowFundsForm($event: any) {
    this.showFunds = $event;
  }

  validationCismart() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res && !this.batchInformation.isPrePreparer) {
          this.showTokenForm = true;
        } else if (this.batchInformation.isPrePreparer) {
          this.isPreSave = this.batchInformation.isPrePreparer;
        }
      }});
  }

  handleTokenSubmit($event: TokenCredentials) {
    if (this.isAuthorizeOperation) {
      this.batchInformation.amount = this.amountHAB + this.amountPROV + this.amountEFE + this.amountACH;
    } else {
      this.batchInformation.amount = this.amount;
    }
    if (!this.batchInformation.isPrePreparer) {
      this.batchInformation.tokenCode = $event.code;
      this.batchInformation.tokenName = $event.name;
    }
    this.batchInformation.spreadsheet.formAchPayments = this.utilsService.roundAmounts(this.batchInformation.spreadsheet.formAchPayments);
    this.batchInformation.spreadsheet.formCashPayments = this.utilsService.roundAmounts(this.batchInformation.spreadsheet.formCashPayments);
    this.batchInformation.spreadsheet.formProvidersPayments = this.utilsService.roundAmounts(this.batchInformation.spreadsheet.formProvidersPayments);
    this.batchInformation.spreadsheet.formSalariesPayments = this.utilsService.roundAmounts(this.batchInformation.spreadsheet.formSalariesPayments);
    this.multiplePaymentService.save(this.batchInformation)
      .subscribe({next: response => {
        this.isTransactionSuccessful = true;
        this.processBatchNumber = response.processBatchId;
        this.showTokenForm = false;
      }, error: _err => this.globalService.danger(this.warningMessagesTitle, _err.message)});
  }

  onClose($event: any) {
    this.showMessageIsBlock = $event;
  }

}
