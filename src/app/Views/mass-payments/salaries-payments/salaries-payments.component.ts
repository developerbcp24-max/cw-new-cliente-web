import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { MassPaymentFavoriteTransactions } from '../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { Operation } from '../../../Services/mass-payments/Models/operation';
import { SalariesPaymentData } from '../../../Services/mass-payments/Models/salaries-payments/salaries-payment-data';
import { SalariesPaymentsSpreadsheetsResult } from '../../../Services/mass-payments/Models/salaries-payments/salaries-payments-spreadsheets-result';
import { SalariesPaymentsService } from '../../../Services/mass-payments/salaries-payments.service';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Constants } from '../../../Services/shared/enums/constants';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { GlobalService } from '../../../Services/shared/global.service';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { UtilsService } from '../../../Services/shared/utils.service';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { PaginationComponent } from '../../shared/cw-components/pagination/pagination.component';
import { UserService } from '../../../Services/users/user.service';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { HeaderDetailComponent } from '../components/header-detail/header-detail.component';
import { UifService } from '../../../Services/uif/uif.service';

declare let $: any;

@Component({
  selector: 'app-salaries-payments',
  standalone: false,
  templateUrl: './salaries-payments.component.html',
  styleUrls: ['./salaries-payments.component.css'],
  providers: [SalariesPaymentsService, TicketsService, UtilsService, UifService],
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class SalariesPaymentsComponent implements OnInit {

  isValidFunds = false;
  showFunds = false;
  showMessage = true;
  showMessageIsBlock = false;
  showTokenForm = false;
  excedeedAmount = false;
  showRemoveFavoriteForm = false;
  scheduleOperation = false;
  showGlossForm = false;
  showFavoriteForm = false;
  isTransactionSuccessful = false;
  validateAmount = false;
  haveErrors = false;
  haveOldPayments = true;
  havefavoritePayments = true;
  isuif = false;
  accountAvailableBalance!: number;
  selectedFavoriteTransaction!: number;
  itemsPerPage = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  spreadsheetSize!: number;
  processBatchNumber!: number;
  globalGloss!: string;
  warningMessagesTitle = 'Pago de haberes';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto: AccountDto;
  spreadsheetPerPage!: SalariesPaymentsSpreadsheetsResult[];
  batchInformation: SalariesPaymentData = new SalariesPaymentData();
  authorizersDto!: InputApprovers;
  previousSpreadsheets!: MassivePaymentsPreviousFormResult[];
  favoriteTransactions!: MassPaymentFavoriteTransactions[];
  amounts: number[] = [];
  amount!: number;
  isAuthorizeOperation: boolean;
  isPreSave = false;
  sourceAccount: AccountResult = new AccountResult();
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  @ViewChild(HeaderDetailComponent) headerUif!: HeaderDetailComponent;
  @ViewChild('globalGlossForm') globalGlossForm!: NgForm;
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  @ViewChild('header') header!: ElementRef;
  is_validbatchtoken!: boolean;
  messagePrePreparer = Constants.messagePrePreparer;

  headerValidation!: boolean;
  approversValidation!: boolean;
  approverLimitsValidation!: boolean;
  emailsValidation!: boolean;
  showModalPreSave = false;
  showModalSetDate = false;

  constructor(private salariesService: SalariesPaymentsService, private globalService: GlobalService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private userService: UserService, private uifService: UifService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoHaberes],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.pagoHaberes;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;
    localStorage.setItem('operationType', OperationType.pagoHaberes.toString());
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
      operationTypeId: OperationType.pagoHaberes,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      accountNumber: $event.formattedNumber
    });
    this.sourceAccount = $event;
    this.batchInformation.formattedNumber = this.sourceAccount.formattedNumber;
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
    this.salariesService.getPreviousSpreadsheets()
      .subscribe({next: response => this.previousSpreadsheets = response, error: _err => this.haveOldPayments = false});
  }

  getFavoriteTransactions() {
    this.salariesService.getFavorites().subscribe({next: response => {
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
    this.salariesService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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

  handleAssignGlobalGloss() {
    this.globalService.validateAllFormFields(this.globalGlossForm.form);
    if (this.globalGlossForm.valid) {
      this.batchInformation.spreadsheet.forEach(x => x.gloss = this.globalGloss);
      this.verifyErrorsGloss();
      this.showGlossForm = false;
      this.globalGloss = undefined!;
    }
  }

  verifyErrorsGloss() {
    if (this.batchInformation.spreadsheet.filter(x => x.isError).length > 0) {
      this.batchInformation.spreadsheet.forEach(x => x.errorMessages = x.errorMessages.replace('La glosa no puede exceder de 30 caracteres<br> ', '').trim());
      this.batchInformation.spreadsheet.forEach(x => x.errorMessages = x.errorMessages.replace('La glosa contiene caracteres extraños.<br>', '').trim());
      for (let item of this.batchInformation.spreadsheet) {
        if (item.errorMessages === '') {
          item.isError = false;
        }
      }
      this.updateSpreadsheet(this.batchInformation.spreadsheet);
    }
  }

  handleSelectFavorite($event: MassPaymentFavoriteTransactions) {
    switch ($event.operation) {
      case Operation.load:
        this.salariesService.getFavoriteDetail(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.salariesService.updateFavorite(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
          .subscribe({next: _response => this.globalService.info('Operación realizada: ', ' ', true),
          error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
        break;
    }
  }

  handleRemoveFavorite() {
    this.salariesService.deleteFavorite(new MassivePaymentsSpreadsheetsDto({ id: this.selectedFavoriteTransaction }))
      .subscribe({next: response => {
        this.globalService.info('Operación realizada: ', response.statusOperation, true);
        this.showRemoveFavoriteForm = false;
        this.getFavoriteTransactions();
      }, error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleLoadFile($event: FormData) {
    this.salariesService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: SalariesPaymentsSpreadsheetsResult[]) {
    this.batchInformation.spreadsheet = spreadsheet;
    this.haveErrors = this.batchInformation.spreadsheet.filter(x => x.isError).length > 0 ? true : false;
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
    this.batchInformation.isPrePreparer = this.isPreSave = false;
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

  // inicio bloque de codigo uif
  showToken() {
    this.uifService.validateOriginDestinationUif(this.batchInformation)

    .subscribe({next: (_res) => {

          for (let i = 0; i < 1; i++) {
            this.batchInformation.uif[i] = new UifDto();
            this.batchInformation.uif[i].isSuspiciusUif = false;
            this.batchInformation.uif[i].trace = Constants.trace;
            this.batchInformation.uif[i].numberQueryUIF = 0;
            this.batchInformation.uif[i].cumulus = 0;
            this.batchInformation.uif[i].causalTransaction = 'PGPDH';
            this.batchInformation.uif[i].typeTransaction = Constants.typeTransaction;
            this.batchInformation.uif[i].sourceFunds = this.batchInformation.fundSource;
            this.batchInformation.uif[i].destinationFunds = this.batchInformation.fundDestination;
            this.batchInformation.uif[i].branchOffice = Constants.branchOffice;
          }
          if (!this.batchInformation.isValidUif) {
            if (this.showModalSetDate) {
              this.handleValidateSetDate();
            } else {
              this.handleValidateUif();
            }
          }
      }, error: _err => {
        this.globalService.info('Validación: ', _err.message);
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
  // Fin bloque de codigo uif

  handleTokenSubmit($event: TokenCredentials) {
    if (!this.batchInformation.isPrePreparer) {
      this.batchInformation.tokenCode = $event.code;
      this.batchInformation.tokenName = $event.name;
    }
    if (this.isAuthorizeOperation) {
      this.batchInformation.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
    } else {
      this.batchInformation.amount = this.amount;
    }
    this.batchInformation.spreadsheet = this.utilsService.roundAmounts(this.batchInformation.spreadsheet);
    this.salariesService.save(this.batchInformation)
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
