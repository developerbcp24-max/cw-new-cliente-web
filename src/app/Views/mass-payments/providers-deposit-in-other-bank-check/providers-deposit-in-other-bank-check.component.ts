import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { Roles } from '../../../Services/shared/enums/roles';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { GlobalService } from '../../../Services/shared/global.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { ExchangeRatesService } from '../../../Services/exchange-rates/exchange-rates.service';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { ProvidersDepositInOtherBankCheckData } from '../../../Services/providersDepositInOtherBankCheck/models/providers-deposit-in-other-bank-check-data';
import { ProvidersDepositInOtherBankCheckService } from '../../../Services/providersDepositInOtherBankCheck/providers-deposit-in-other-bank-check.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { NgForm } from '@angular/forms';
import { PaginationComponent } from '../../shared/cw-components/pagination/pagination.component';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { MassPaymentFavoriteTransactions } from '../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { Constants } from '../../../Services/shared/enums/constants';
import { ProvidersDepositInOtherBankCheckSpreadsheetsResult } from '../../../Services/providersDepositInOtherBankCheck/models/providers-deposit-in-other-bank-check-spreadsheets-result';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { Operation } from '../../../Services/mass-payments/Models/operation';
import { UserService } from '../../../Services/users/user.service';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { HeaderDetailComponent } from '../components/header-detail/header-detail.component';
import { UifService } from '../../../Services/uif/uif.service';

@Component({
  selector: 'app-providers-deposit-in-other-bank-check',
  standalone: false,
  templateUrl: './providers-deposit-in-other-bank-check.component.html',
  styleUrls: ['./providers-deposit-in-other-bank-check.component.css'],
  providers: [AccountsService, ExchangeRatesService, TicketsService, UtilsService, ProvidersDepositInOtherBankCheckService, UifService]
})
export class ProvidersDepositInOtherBankCheckComponent implements OnInit {

  isValidFunds = false;
  showFunds = false;
  showMessageIsBlock = false;
  showTokenForm = false;
  excedeedAmount = false;
  showRemoveFavoriteForm = false;
  scheduleOperation = false;
  showFavoriteForm = false;
  isTransactionSuccessful = false;
  validateAmount = false;
  haveOldPayments = true;
  havefavoritePayments = true;
  accountAvailableBalance!: number;
  selectedFavoriteTransaction!: number;
  itemsPerPage = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  spreadsheetSize!: number;
  processBatchNumber!: number;
  warningMessagesTitle = 'Pago a proveedores en otro banco cheque';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto: AccountDto;
  spreadsheetPerPage!: ProvidersDepositInOtherBankCheckSpreadsheetsResult[];
  batchInformation: ProvidersDepositInOtherBankCheckData = new ProvidersDepositInOtherBankCheckData();
  authorizersDto!: InputApprovers;
  previousSpreadsheets!: MassivePaymentsPreviousFormResult[];
  favoriteTransactions!: MassPaymentFavoriteTransactions[];
  amounts: number[] = [];
  amount!: number;
  isAuthorizeOperation: boolean;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  @ViewChild(HeaderDetailComponent) headerUif!: HeaderDetailComponent;
  isPreSave = false;
  sourceAccount: AccountResult = new AccountResult();
  is_validbatchtoken!: boolean;
  messagePrePreparer = Constants.messagePrePreparer;

  headerValidation!: boolean;
  approversValidation!: boolean;
  approverLimitsValidation!: boolean;
  emailsValidation!: boolean;
  showModalPreSave = false;
  showModalSetDate = false;

  constructor(private otherBankCheckService: ProvidersDepositInOtherBankCheckService, private globalService: GlobalService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private userService: UserService, private uifService: UifService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoProveedoresOtrosBancosCheque],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.pagoProveedoresOtrosBancosCheque;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;
    localStorage.setItem('operationType', OperationType.pagoProveedoresOtrosBancosCheque.toString());
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleAccountChanged($event: AccountResult) {
    this.authorizersDto = new InputApprovers({
      operationTypeId: OperationType.pagoProveedoresOtrosBancosCheque,
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

  handlePageChanged(pageNumber: number) {
    this.spreadsheetPerPage = this.batchInformation.spreadsheet.slice((pageNumber - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber);
  }

  getPreviousSpreadsheets() {
    this.otherBankCheckService.getPreviousSpreadsheets()
      .subscribe({next: response => this.previousSpreadsheets = response,
        error: _err => this.haveOldPayments = false});
  }

  getFavoriteTransactions() {
    this.otherBankCheckService.getFavorites().subscribe({next: response => {
      this.favoriteTransactions = response;
      this.havefavoritePayments = response.length > 0 ? true : false;
    }, error: _err => this.havefavoritePayments = false});
  }

  updateBatchAmount(): void {
    this.batchInformation.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
    if (this.isAuthorizeOperation) {
      this.amounts = this.batchInformation.spreadsheet.map(x => +x.amount);
    } else {
      this.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
    }
    if (this.batchInformation.amount <= 0) {
      this.validateAmount = true;
    } else {
      this.validateAmount = false;
    }
  }

  handleSelectSpreadsheetId($event: MassivePaymentsPreviousFormResult) {
    this.otherBankCheckService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
       error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleGroupChanged($event: number) {
    if ($event === 1) {
      this.getFavoriteTransactions();
    } else if ($event === 3) {
      this.getPreviousSpreadsheets();
    }
  }

  handleViewRows($event: string) {
    this.itemsPerPage = +$event;
    this.handlePageChanged(0);
  }

  handleSelectFavorite($event: MassPaymentFavoriteTransactions) {
    switch ($event.operation) {
      case Operation.load:
        this.otherBankCheckService.getFavoriteDetail(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
          .subscribe({next: response => {
            this.batchInformation = response;
            this.updateSpreadsheet(response.spreadsheet);
          }, error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
        break;
      case Operation.remove:
        this.showRemoveFavoriteForm = true;
        this.selectedFavoriteTransaction = $event.id;
        break;
      case Operation.update:
        this.otherBankCheckService.updateFavorite(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
          .subscribe({next: _response => this.globalService.info('Operación realizada: ', ' ', true),
           error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
        break;
    }
  }

  handleRemoveFavorite() {
    this.otherBankCheckService.deleteFavorite(new MassivePaymentsSpreadsheetsDto({ id: this.selectedFavoriteTransaction }))
      .subscribe({next: response => {
        this.globalService.info('Operación realizada: ', response.statusOperation, true);
        this.showRemoveFavoriteForm = false;
        this.getFavoriteTransactions();
      }, error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleLoadFile($event: FormData) {
    this.otherBankCheckService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: ProvidersDepositInOtherBankCheckSpreadsheetsResult[]) {
    this.batchInformation.spreadsheet = spreadsheet;
    this.updateBatchAmount();
    this.spreadsheetSize = spreadsheet.length;
    if (this.pagination !== undefined) { this.pagination.ngOnChanges(); }
  }

  handleValidate(headerValidation: boolean, approversValidation: boolean, approverLimitsValidation: boolean, emailsValidation: boolean, isBtnPresave: boolean) {
    this.headerValidation = headerValidation;
    this.approversValidation = approversValidation;
    this.approverLimitsValidation = approverLimitsValidation;
    this.emailsValidation = emailsValidation;
    this.showModalPreSave = isBtnPresave;
    this.showToken();
  }

  handleValidateUif() {
    if (this.headerValidation && this.approversValidation && this.approverLimitsValidation && this.emailsValidation && !this.batchInformation.spreadsheet.find(x => x.isError)) {
      this.isPreSave = this.showModalPreSave;
      this.batchInformation.isPrePreparer = this.isPreSave ? true : false;
      if (!this.batchInformation.isTicket) {
        this.validateAmounts();
      } else {
        this.validateGMESATicket();
      }
    }
  }

  handleIsPreparer($event: any) {
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
    this.isPreSave = false;
  }

  handleValidateFavorite() {
    this.globalService.validateAllFormFields(this.saveFavoriteForm.form);
    if (this.saveFavoriteForm.valid) {
      this.batchInformation.isFavorite = true;
      this.showFavoriteForm = false;
    }
  }

  handleValidateSetDate() {
    if (this.headerValidation && this.approversValidation && this.approverLimitsValidation && this.emailsValidation && !this.batchInformation.spreadsheet.find(x => x.isError)) {
      if (this.batchInformation.amount > 0) {
        this.scheduleOperation = true;
      } else {
        this.validateAmount = true;
      }
    }
    this.showModalSetDate = false;
  }

  handleValidateForScheduleOperation(headerValidation: boolean, approversValidation: boolean, approverLimitsValidation: boolean, emailsValidation: boolean, isSetDate: boolean) {
    this.headerValidation = headerValidation;
    this.approversValidation = approversValidation;
    this.approverLimitsValidation = approverLimitsValidation;
    this.emailsValidation = emailsValidation;
    this.showModalSetDate = isSetDate;
    this.batchInformation.isPrePreparer = this.isPreSave = this.showModalPreSave = false;
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
    this.updateSpreadsheet(this.batchInformation.spreadsheet);
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
    this.uifService.validateOriginDestinationUif(this.batchInformation)
    .subscribe({next: (_res) => {
        for (let i = 0; i < 1; i++) {
          this.batchInformation.uif[i] = new UifDto();
          this.batchInformation.uif[i].isSuspiciusUif = false;
          this.batchInformation.uif[i].trace = 'SIN TRACE';
          this.batchInformation.uif[i].numberQueryUIF = 0;
          this.batchInformation.uif[i].cumulus = 0;
          this.batchInformation.uif[i].causalTransaction = 'PGPRO';
          this.batchInformation.uif[i].typeTransaction = 'LAVA';
          this.batchInformation.uif[i].sourceFunds = this.batchInformation.fundSource;
          this.batchInformation.uif[i].destinationFunds = this.batchInformation.fundDestination;
          this.batchInformation.uif[i].branchOffice = '201204';
        }
        if (!this.batchInformation.isValidUif) {
          if (this.showModalSetDate) {
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

  onClose($event: any) {
    this.showMessageIsBlock = $event;
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
      this.batchInformation.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
    } else {
      this.batchInformation.amount = this.amount;
    }
    if (!this.batchInformation.isPrePreparer) {
      this.batchInformation.tokenCode = $event.code;
      this.batchInformation.tokenName = $event.name;
    }
    this.batchInformation.spreadsheet = this.utilsService.roundAmounts(this.batchInformation.spreadsheet);
    this.otherBankCheckService.save(this.batchInformation)
      .subscribe({next: response => {
        this.isTransactionSuccessful = true;
        this.processBatchNumber = response.processBatchId;
        this.showTokenForm = false;
      }, error: _err => this.globalService.danger(this.warningMessagesTitle, _err.message)});
  }

  handleNewOperation() {
    this.batchInformation.currency = '';
    this.batchInformation.amount = 0;
    this.batchInformation.spreadsheet = [];
  }
}
