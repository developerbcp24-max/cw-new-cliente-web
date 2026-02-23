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
import { ProvidersCheckManagementService } from '../../../Services/providersCheckManagement/providers-check-management.service';
import { ProvidersCheckManagementSpreadsheetsResult } from '../../../Services/providersCheckManagement/models/providers-check-management-spreadsheets-result';
import { ProvidersCheckManagementData } from '../../../Services/providersCheckManagement/models/providers-check-management-data';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { Constants } from '../../../Services/shared/enums/constants';
import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { MassPaymentFavoriteTransactions } from '../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { PaginationComponent } from '../../shared/cw-components/pagination/pagination.component';
import { NgForm } from '@angular/forms';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { Operation } from '../../../Services/mass-payments/Models/operation';
import { UserService } from '../../../Services/users/user.service';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { HeaderDetailComponent } from '../components/header-detail/header-detail.component';
import { UifService } from '../../../Services/uif/uif.service';
import { FavoriteTransactionDto } from '../../../Services/mass-payments/Models/FavoriteTransactionDto';
import { MassivePaymentsPreviousFormDto } from '../../../Services/mass-payments/Models/MassivePaymentsPreviousFormDto';
@Component({
  selector: 'app-providers-check-management-lip',
  standalone: false,
  templateUrl: './providers-check-management-lip.component.html',
  styleUrls: ['./providers-check-management-lip.component.css'],
  providers: [AccountsService, ExchangeRatesService, TicketsService, UtilsService, ProvidersCheckManagementService, UifService]
})
export class ProvidersCheckManagementLipComponent implements OnInit {
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
  warningMessagesTitle = 'Pago a proveedores con cheque de gerencia ';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto: AccountDto;
  spreadsheetPerPage!: ProvidersCheckManagementSpreadsheetsResult[];
  batchInformation: ProvidersCheckManagementData = new ProvidersCheckManagementData();
  authorizersDto!: InputApprovers;
  previousSpreadsheets!: MassivePaymentsPreviousFormResult[];
  favoriteTransactions!: MassPaymentFavoriteTransactions[];
  amounts: number[] = [];
  amount!: number;
  isAuthorizeOperation: boolean;///ojo
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  @ViewChild(HeaderDetailComponent) headerUif!: HeaderDetailComponent;
  isPreSave = false;
  sourceAccount: AccountResult = new AccountResult();
  _opertaionType: FavoriteTransactionDto =new FavoriteTransactionDto();
  _typeOperatio: MassivePaymentsPreviousFormDto = new MassivePaymentsPreviousFormDto();
  is_validbatchtoken!: boolean;
  messagePrePreparer = Constants.messagePrePreparer;

  headerValidation!: boolean;
  approversValidation!: boolean;
  approverLimitsValidation!: boolean;
  emailsValidation!: boolean;
  showModalPreSave = false;
  showModalSetDate = false;

  constructor(private checkManagementService: ProvidersCheckManagementService, private globalService: GlobalService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private userService: UserService, private uifService: UifService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoProveedoresChequeGerencia],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.pagoProveedoresChequeGerenciaLip;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;
    localStorage.setItem('operationType', OperationType.pagoProveedoresChequeGerenciaLip.toString());
  }
  ngOnInit(): void {
    this.userService.getValidateCurrentUser();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleAccountChanged($event: AccountResult) {
    this.authorizersDto = new InputApprovers({
      operationTypeId: OperationType.pagoProveedoresChequeGerencia,
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
    this._typeOperatio.OperationType=46;
    this.checkManagementService.getPreviousSpreadsheets(this._typeOperatio)
      .subscribe({next: response => this.previousSpreadsheets = response, error: _err => this.haveOldPayments = false});
  }

  getFavoriteTransactions() {
    this._opertaionType.OperationTypeId=46;
    this.checkManagementService.getFavorites(this._opertaionType).subscribe({next: response => {
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
    this.checkManagementService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.checkManagementService.getFavoriteDetail(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.checkManagementService.updateFavorite(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
          .subscribe({next: _response => this.globalService.warning('Operación realizada: ', ' ', true),
          error:_err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
        break;
    }
  }

  handleRemoveFavorite() {
    this.checkManagementService.deleteFavorite(new MassivePaymentsSpreadsheetsDto({ id: this.selectedFavoriteTransaction }))
      .subscribe({next: response => {
        this.globalService.warning('Operación realizada: ', response.statusOperation, true);
        this.showRemoveFavoriteForm = false;
        this.getFavoriteTransactions();
      }, error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleLoadFile($event: FormData) {
    this.checkManagementService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: ProvidersCheckManagementSpreadsheetsResult[]) {
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
    this.checkManagementService.save(this.batchInformation)
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
