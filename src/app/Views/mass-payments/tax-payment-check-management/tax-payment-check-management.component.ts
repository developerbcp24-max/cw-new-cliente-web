import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { TaxPaymentCheckService } from '../../../Services/taxPaymentCheck/tax-payment-check.service';
import { Roles } from '../../../Services/shared/enums/roles';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { GlobalService } from '../../../Services/shared/global.service';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { ExchangeRatesService } from '../../../Services/exchange-rates/exchange-rates.service';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { UtilsService } from '../../../Services/shared/utils.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { Constants } from '../../../Services/shared/enums/constants';
import { PaymentTaxCheckSpreadsheetsResult } from '../../../Services/taxPaymentCheck/models/payment-tax-check-spreadsheets-result';
import { PaymentTaxCheckData } from '../../../Services/taxPaymentCheck/models/payment-tax-check-data';
import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { MassPaymentFavoriteTransactions } from '../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { PaginationComponent } from '../../shared/cw-components/pagination/pagination.component';
import { NgForm } from '@angular/forms';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { Operation } from '../../../Services/mass-payments/Models/operation';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-tax-payment-check-management',
  standalone: false,
  templateUrl: './tax-payment-check-management.component.html',
  styleUrls: ['./tax-payment-check-management.component.css'],
  providers: [AccountsService, TaxPaymentCheckService, ExchangeRatesService, UtilsService, TicketsService]
})
export class TaxPaymentCheckManagementComponent implements OnInit {
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
  warningMessagesTitle = 'Pago de impuestos con cheque de gerencia ';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto: AccountDto;
  spreadsheetPerPage!: PaymentTaxCheckSpreadsheetsResult[];
  batchInformation: PaymentTaxCheckData = new PaymentTaxCheckData();
  authorizersDto!: InputApprovers;
  previousSpreadsheets!: MassivePaymentsPreviousFormResult[];
  favoriteTransactions!: MassPaymentFavoriteTransactions[];
  amounts: number[] = [];
  amount!: number;
  isAuthorizeOperation: boolean;
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  isPreSave = false;
  sourceAccount: AccountResult = new AccountResult();
  is_validbatchtoken!: boolean;
  messagePrePreparer = Constants.messagePrePreparer;

  constructor(private taxCheckService: TaxPaymentCheckService, private globalService: GlobalService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private userService: UserService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoImpuestoGerencia],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.pagoImpuestoGerencia;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;
    localStorage.setItem('operationType', OperationType.pagoImpuestoGerencia.toString());
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
      operationTypeId: OperationType.pagoImpuestoGerencia,
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
    this.taxCheckService.getPreviousSpreadsheets()
      .subscribe({next: response => this.previousSpreadsheets = response, error: _err => this.haveOldPayments = false});
  }

  getFavoriteTransactions() {
    this.taxCheckService.getFavorites().subscribe({next: response => {
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
    this.taxCheckService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.taxCheckService.getFavoriteDetail(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.taxCheckService.updateFavorite(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
          .subscribe({next: _response => this.globalService.info('Operación realizada: ', ' ', true),
          error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
        break;
    }
  }

  handleRemoveFavorite() {
    this.taxCheckService.deleteFavorite(new MassivePaymentsSpreadsheetsDto({ id: this.selectedFavoriteTransaction }))
      .subscribe({next: response => {
        this.globalService.info('Operación realizada: ', response.statusOperation, true);
        this.showRemoveFavoriteForm = false;
        this.getFavoriteTransactions();
      }, error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleLoadFile($event: FormData) {
    this.taxCheckService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: PaymentTaxCheckSpreadsheetsResult[]) {
    this.batchInformation.spreadsheet = spreadsheet;
    this.updateBatchAmount();
    this.spreadsheetSize = spreadsheet.length;
    if (this.pagination !== undefined) { this.pagination.ngOnChanges(); }
  }

  handleValidate(headerValidation: boolean, approversValidation: boolean, approverLimitsValidation: boolean, emailsValidation: boolean, isPresave: boolean) {
    if (headerValidation && approversValidation && approverLimitsValidation && emailsValidation && !this.batchInformation.spreadsheet.find(x => x.isError)) {
      this.isPreSave = isPresave;
      this.batchInformation.isPrePreparer = isPresave;
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

  handleValidateForScheduleOperation(headerValidation: boolean, approversValidation: boolean, approverLimitsValidation: boolean, emailsValidation: boolean) {
    if (headerValidation && approversValidation && approverLimitsValidation && emailsValidation && !this.batchInformation.spreadsheet.find(x => x.isError)) {
      if (this.batchInformation.amount > 0) {
        this.scheduleOperation = true;
      } else {
        this.validateAmount = true;
      }
      this.batchInformation.isPrePreparer = this.isPreSave = false;
    }
  }

  handleDateFuture($event: DateFutureModel) {
    this.batchInformation.isScheduledProcess = $event.isDateFuture;
    this.batchInformation.scheduledProcess = $event.date;
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
    this.taxCheckService.save(this.batchInformation)
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
