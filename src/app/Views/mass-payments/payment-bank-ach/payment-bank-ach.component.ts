import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { UtilsService } from '../../../Services/shared/utils.service';
import { ExchangeRatesService } from '../../../Services/exchange-rates/exchange-rates.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { PaymentAchService } from '../../../Services/mass-payments/payment-ach.service';
import { PaymentAchData } from '../../../Services/mass-payments/Models/payment-ach/payment-ach-data';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { MassPaymentFavoriteTransactions } from '../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { Constants } from '../../../Services/shared/enums/constants';
import { NgForm } from '@angular/forms';
import { PaymentAchSpreadsheetResult } from '../../../Services/mass-payments/Models/payment-ach/payment-ach-spreadsheet-result';
import { Operation } from '../../../Services/mass-payments/Models/operation';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { PaginationComponent } from '../../shared/cw-components/pagination/pagination.component';
import { UserService } from '../../../Services/users/user.service';
import { UifService } from '../../../Services/uif/uif.service';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { HeaderDetailComponent } from '../components/header-detail/header-detail.component';
import { EventLogRequest } from '../../../Services/mass-payments/Models/event-log-request';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { AuthenticationService } from '../../../Services/users/authentication.service';
import { IpAddresService } from '../../../Services/users/ip-addres.service';
import { catchError } from 'rxjs';
import { DBFDMonitorService } from '../../../Services/DBFDMonitor/dbfdmonitor.service';
@Component({
  selector: 'app-payment-bank-ach',
  standalone: false,
  templateUrl: './payment-bank-ach.component.html',
  styleUrls: ['./payment-bank-ach.component.css'],
  providers: [PaymentAchService, ExchangeRatesService, UtilsService, TicketsService, UifService, DBFDMonitorService]
})
export class PaymentBankAchComponent implements OnInit {

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
  showFundsDestination = false;
  validateProdem = false;
  accountAvailableBalance!: number;
  selectedFavoriteTransaction!: number;
  itemsPerPage = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  spreadsheetSize!: number;
  processBatchNumber!: number;
  warningMessagesTitle = 'Pago a proveedores ACH';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto: AccountDto;
  spreadsheetPerPage!: PaymentAchSpreadsheetResult[];
  batchInformation: PaymentAchData = new PaymentAchData();
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
  @ViewChild('buttonGroup') buttonGroup!: NgForm;
  isActiveButton = true;
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

  eventLog = new EventLogRequest();

  constructor(private ipEnc: IpAddresService,private achService: PaymentAchService, private globalService: GlobalService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private cdRef: ChangeDetectorRef, private userService: UserService, private uifService: UifService,
    private authenticationService: AuthenticationService, private paramService: ParametersService, private monitor: DBFDMonitorService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoProveedoresAch],
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.pagoProveedoresAch;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;

    localStorage.setItem('operationType', OperationType.pagoProveedoresAch.toString());
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
    this.getIpAddres();


  }

  async getIpAddres() {
    try {
      const ip = await this.ipEnc.getClientIp();
      this.batchInformation.ip  = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.batchInformation.ip = 'NOT_IP';
    }
    /* this.ipEnc.getIpClient().pipe(
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
      operationTypeId: OperationType.pagoProveedoresAch,
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
    this.achService.getPreviousSpreadsheets()
      .subscribe({next: response => this.previousSpreadsheets = response,
        error: _err => this.haveOldPayments = false});
  }

  getFavoriteTransactions() {
    this.achService.getFavorites().subscribe({next: response => {
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

  handleSelectSpreadsheetId($event: MassivePaymentsPreviousFormResult, _boton?: number) {
    this.achService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.achService.getFavoriteDetail(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
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
        this.achService.updateFavorite(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
          .subscribe({next: _response => this.globalService.warning('Operación realizada', '', true),
          error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
        break;
    }
  }

  handleRemoveFavorite() {
    this.achService.deleteFavorite(new MassivePaymentsSpreadsheetsDto({ id: this.selectedFavoriteTransaction }))
      .subscribe({next: response => {
        this.globalService.warning('Operación realizada', response.statusOperation, true);
        this.showRemoveFavoriteForm = false;
        this.getFavoriteTransactions();
      }, error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleLoadFile($event: FormData) {
    this.achService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => {
        this.updateSpreadsheet(spreadsheet)
      },
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: PaymentAchSpreadsheetResult[]) {
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
    this.monitor.superviceMonitor(this.batchInformation)
    .subscribe({next: (resp: PaymentAchSpreadsheetResult[]) => {
      resp.forEach(element => {
        if(element.operationStatusId!=0){
          this.batchInformation.operationStatusId=14
        }
      });
      this.batchInformation.spreadsheet=resp;
    }})
  }
  clickEventLogSend(boton: number) {
    if (OperationType.pagoProveedoresAch == 24) {
      let tipoBoton = "";
      switch (boton) {
        case 1: tipoBoton = "Preparar Transaccion"; break;
        case 2: tipoBoton = "Enviar a Preparacion Masiva"; break;
        case 3: tipoBoton = "Programar"; break;
        case 4: tipoBoton = "Guardar como Favorito"; break;
      }
      this.eventLog.eventName = "Click " + tipoBoton;
      this.eventLog.eventType = "button";
      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  changeEventLogFavorito(tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      switch (tipo) {
        case 1:
          this.eventLog.eventName = "Ingreso de datos Descripcion Favorito";
          this.eventLog.eventType = "input";
          break;
        case 2:
          this.eventLog.eventName = "Click Enviar Favorito";
          this.eventLog.eventType = "button";
          break;
        case 3:
          this.eventLog.eventName = "Click Cancelar Favorito";
          this.eventLog.eventType = "link";
          break;
      }

      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  handleValidateUif() {
    if (this.headerValidation && this.approversValidation && this.approverLimitsValidation && this.emailsValidation && !this.batchInformation.spreadsheet.find(x => x.isError)) {
      if (!this.utilsService.validateProdem(this.batchInformation.currency, this.batchInformation.spreadsheet)) {
        this.isPreSave = this.showModalPreSave;
        this.batchInformation.isPrePreparer = this.isPreSave ? true : false;
        this.validateProdem = false;
        if (!this.batchInformation.isTicket) {
          this.validateAmounts();
        } else {
          this.validateGMESATicket();
        }
      } else {
        this.validateProdem = true;
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
          this.validationCismart();
        } else {
          this.globalService.warning('Ticket preferencial incorrecto, ', response.errorMessage, true);
        }
      }, error: _err => this.globalService.warning('Servicio mesa de dinero', _err.message)});
  }
  // inicio bloque de codigo uif
  showToken() {
    this.getIpAddres();
    this.uifService.validateOriginDestinationUif(this.batchInformation)
      .subscribe({next: (_res) => {
        for (let i = 0; i < 1; i++) {
          this.batchInformation.uif[i] = new UifDto();
          this.batchInformation.uif[i].isSuspiciusUif = false;
          this.batchInformation.uif[i].trace = 'SIN TRACE';
          this.batchInformation.uif[i].numberQueryUIF = 0;
          this.batchInformation.uif[i].cumulus = 0;
          this.batchInformation.uif[i].causalTransaction = 'TRACH';
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
  // Fin bloque de codigo uif

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
    this.achService.save(this.batchInformation)
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
