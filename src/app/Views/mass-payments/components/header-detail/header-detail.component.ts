import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { CashOnline } from '../../../../Services/accounts/models/CashOnline';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ProcessBatchDto } from '../../../../Services/shared/models/process-batch';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { SourceAccountsComponent } from '../../../../Views/shared/cw-components/source-accounts/source-accounts.component';
import { TicketComponent } from '../../../../Views/shared/cw-components/ticket/ticket.component';

@Component({
  selector: 'app-header-detail',
  standalone: false,
  templateUrl: './header-detail.component.html',
  styleUrls: ['./header-detail.component.css'],
  providers: [ParametersService, UtilsService]
})
export class HeaderDetailComponent implements OnInit, OnChanges {

  currencies: ParameterResult [] = [];
  currenciesAll: ParameterResult [] = [];
  isShowOriginAndDestinationFundsForm = false;
  showFundsForm = false;
  @Output() isShowFundsForm = new EventEmitter<boolean>();
  minimumAmountUIF!: number;
  showCompanyLimits = false;
  currencyName!: string;
  @Input() sameCurrency = false;
  @Input() isCashOnline = false;
  @Input() batchInformation!: ProcessBatchDto;
  @Input() accountDto!: AccountDto;
  @Input() disabled = false;
  @Input() amount!: number;
  @Input() showGlossField = false;
  @Input() showAchWarningMessage = false;
  @Input() isManualPayment = false;
  @Input() isDepositCheck = false;
  @Input() isDebitVisible = false;
  @Input() isuif!: boolean;
  @Input() noFunds = false;
  @Output() headerResultChange = new EventEmitter<AccountResult>();
  @Output() curren = new EventEmitter<string>();
  @ViewChild('sourceAccount') sourceAccountComponent!: SourceAccountsComponent;
  @ViewChild('ticket') ticketComponent!: TicketComponent;
  @ViewChild('descriptionForm') descriptionForm!: NgForm;
  @ViewChild('currencyForm') currencyForm!: NgForm;
  @ViewChild('currencySelectDiv') currencySelect!: ElementRef;
  @Input() isVisibleFunds = true;
  responseUif = false;
  aux: any;
  eventLog = new EventLogRequest();
  isValidateCurreny = false;
  isCashOnlineNew: CashOnline = new CashOnline()
  currenDesc: any;

  constructor(private paramService: ParametersService, private utilsService: UtilsService, private globalService: GlobalService,
    private authenticationService: AuthenticationService, private parametersService: ParametersService) { }

  ngOnInit() {
    this.parametersService.getByGroupAndCode(new ParameterDto ({group:'RESUSD',code:'USD'}))
      .subscribe({next: resp => {
        this.isValidateCurreny = resp.value == 'A';
        this.sameCurrency = this.sameCurrency ? this.sameCurrency : this.isValidateCurreny;
      }});
      this.parametersService.getByGroup(new ParameterDto ({group:'MONEFE'}))
      .subscribe({next: resp => {
        this.currencies = this.currenciesAll = resp;
      }});
    this.currencyName = "Seleccione una Moneda"
    if (this.noFunds) {
      this.getMinimumAmountUIF();
    }
    this.utilsService.getLastOne();
      this.newCashOnline("");
    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (!this.utilsService.isUif()) {
      if (this.utilsService.showOriginDestinationFunds()) {
        this.handleShowFunds();
        return;
      }
      setTimeout(() => {
        if (changes.amount !== undefined && !changes.amount.isFirstChange()) {
          this.showOriginAndDestinationFundsForm();
        }
      });
    }
  }

  handleAccountChanged($event: AccountResult) {
    this.currencies = this.currenciesAll;
    this.batchInformation.sourceAccount = $event.number;
    this.batchInformation.sourceAccountId = $event.id;
    this.batchInformation.sourceCurrency = $event.currency;
    this.newCashOnline($event.currency);
    this.headerResultChange.emit($event);
  }

  newCashOnline(event: string){
    if (this.isCashOnline) {
      this.batchInformation.currency = 'BOL';
      this.currencies = this.currenciesAll.filter(x => x.value === 'BOL');
      this.currenDesc = this.currencies[0]?.description;
    }
    else if (this.sameCurrency) {
      this.batchInformation.currency = event;
      if (event == 'BOL') {
        this.currencies = this.currenciesAll.filter(x => x.code == 'BOL');
        this.currenDesc = this.currencies[0]?.description;
        this.showOriginAndDestinationFundsForm();
      } else if (event === 'USD') {
        this.currencies = this.currenciesAll.filter(x => x.code == 'USD');
        this.currenDesc = this.currencies[0]?.description;
        this.showOriginAndDestinationFundsForm();
      } else {
        this.batchInformation.currency = '';
        this.currencies = this.currenciesAll;
      }
    }
  }
  getMinimumAmountUIF() {
    this.paramService.getByGroupAndCode(new ParameterDto({ group: 'PRE', code: 'MONTO' }))
      .subscribe({ next: response => this.minimumAmountUIF = +response.value });
  }

  handleShowFunds() {
    this.showFundsForm = this.isShowOriginAndDestinationFundsForm = true;
    this.isShowFundsForm.emit(this.showFundsForm);
  }

  showOriginAndDestinationFundsForm() {
    if (!this.utilsService.isUif()) {
      if (this.batchInformation.currency === undefined) {
        return;
      }
      this.isShowOriginAndDestinationFundsForm = true;
      this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    }
  }

  changeEventLogCurrency() {
    if (this.accountDto.operationTypeId![0] == 24) {
      this.eventLog.eventName = "Seleccion de moneda";
      this.eventLog.eventType = "select";
      this.eventLog.previousData = "";
      this.eventLog.updateData = this.batchInformation.currency;
      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  blurEventLogACH(typeE: number, event: any) {
    if (this.accountDto.operationTypeId![0] == 24) {
      switch (typeE) {
        case 1:
          if (this.batchInformation.fundSource === undefined) {
            return;
          }
          this.eventLog.eventName = "Ingreso de datos Origen de fondos";
          this.eventLog.previousData = "";
          this.eventLog.updateData = this.batchInformation.fundSource;
          this.eventLog.eventType = event.target.localName;
          break;
        case 2:
          if (this.batchInformation.fundDestination === undefined) {
            return;
          }
          this.eventLog.eventName = "Ingreso de datos Destino de fondos";
          this.eventLog.previousData = "";
          this.eventLog.updateData = this.batchInformation.fundDestination;
          this.eventLog.eventType = event.target.localName;
          break;
        case 3:
          if (this.batchInformation.description === undefined) {
            return;
          }
          this.eventLog.eventName = "Ingreso de datos Descripción";
          this.eventLog.previousData = "";
          this.eventLog.updateData = this.batchInformation.description;
          this.eventLog.eventType = event.target.localName;
          break;
        case 4:
          if (this.batchInformation.gloss === undefined) {
            return;
          }
          this.eventLog.eventName = "Ingreso de datos Glosa";
          this.eventLog.previousData = "";
          this.eventLog.updateData = this.batchInformation.gloss;
          this.eventLog.eventType = event.target.localName;
          break;
      }

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  changeEventLog(_event: any) {
    if (this.accountDto.operationTypeId![0] == 24) {
      if (this.batchInformation.isMultipleDebits === undefined) {
        return;
      }
      if (this.batchInformation.isMultipleDebits) {
        this.eventLog.eventName = "Check Debito multiple";
        this.eventLog.previousData = "";
        this.eventLog.updateData = "Debito multiple";
      }
      else {
        this.eventLog.eventName = "Check Un solo debito";
        this.eventLog.previousData = "";
        this.eventLog.updateData = "Un solo debito";
      }

      this.eventLog.eventType = "input radio";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  handleValidateFunds() {
    this.batchInformation.fundSource = this.batchInformation.fundSource === null ? undefined! :
      this.batchInformation.fundSource === undefined! ? undefined! :
        this.batchInformation.fundSource;
    this.batchInformation.fundDestination = this.batchInformation.fundDestination === null ? undefined! :
      this.batchInformation.fundDestination === undefined! ? undefined! :
        this.batchInformation.fundDestination;
  }

  validateUif() {
    this.isShowOriginAndDestinationFundsForm = true;
    this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    this.handleValidateFunds();
    this.currencySelect.nativeElement.focus();
  }

  handleValidateFuds() {
    if (this.batchInformation.fundSource !== undefined) {
      this.batchInformation.fundSource = this.batchInformation.fundSource?.trim().length >= 15 ? this.batchInformation.fundSource : undefined!;
    }
    if (this.batchInformation.fundDestination !== undefined) {
      this.batchInformation.fundDestination = this.batchInformation.fundDestination?.trim().length >= 15 ? this.batchInformation.fundDestination : undefined!;
    }
    if (this.batchInformation.description !== undefined) {
      this.batchInformation.description = this.batchInformation.description?.trim().length >= 3 ? this.batchInformation.description : undefined!;
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.descriptionForm.form);
    this.globalService.validateAllFormFields(this.currencyForm.form);
    if (!this.noFunds) {
      this.handleValidateFuds();
    }
    if (!this.utilsService.isUif()) {
      if (!this.currencyForm.valid && this.isShowOriginAndDestinationFundsForm) {
        this.currencySelect.nativeElement.focus();
      }
      if (this.noFunds) {
        if (this.isCashOnline) {
          return this.sourceAccountComponent.handleValidate() && this.descriptionForm.valid && this.currencyForm.valid;
        }
        return this.sourceAccountComponent.handleValidate() && (this.isManualPayment || this.ticketComponent.handleValidate()) && this.descriptionForm.valid;
      }
      if (this.batchInformation.fundSource !== undefined && this.batchInformation.fundDestination !== undefined && this.batchInformation.description !== undefined) {
        if (this.isCashOnline) {
          return this.sourceAccountComponent.handleValidate() && this.descriptionForm.valid && this.currencyForm.valid;
        }
        return this.sourceAccountComponent.handleValidate() && (this.isManualPayment || this.ticketComponent.handleValidate()) && this.descriptionForm.valid && this.currencyForm.valid;
      } else {
        this.currencySelect.nativeElement.focus();
        this.globalService.info('Nota: ', ' El Origen y Destino de fondos debe contener mínimo 15 caracteres y la Descripción debe contener mínimo 3 caracteres.');
        return false;
      }
    } else {
      if (this.isShowOriginAndDestinationFundsForm && this.currencyForm.valid) {
        if (this.batchInformation.fundSource !== undefined && this.batchInformation.fundDestination !== undefined) {
          if (this.isCashOnline) {
            return this.sourceAccountComponent.handleValidate() && this.descriptionForm.valid && this.currencyForm.valid;
          }
          return this.sourceAccountComponent.handleValidate() && (this.isManualPayment || this.ticketComponent.handleValidate()) && this.descriptionForm.valid && this.currencyForm.valid;
        } else {
          this.currencySelect.nativeElement.focus();
          this.globalService.info('Nota: ', ' El Origen y Destino de fondos debe contener mínimo 15 caracteres y la Descripción debe contener mínimo 3 caracteres.');
          return false;
        }
      } else {
        if (this.isCashOnline) {
          return this.sourceAccountComponent.handleValidate() && this.descriptionForm.valid && this.currencyForm.valid;
        }
        return this.sourceAccountComponent.handleValidate() && (this.isManualPayment || this.ticketComponent.handleValidate()) && this.descriptionForm.valid && this.currencyForm.valid;
      }
    }
  }

  handleNewOperation() {
    window.scroll(0, 0);
    this.batchInformation.currency = '';
    this.batchInformation.amount = 0;
    this.batchInformation.fundSource = undefined!;
    this.batchInformation.fundDestination = undefined!;
    this.batchInformation.description = undefined!;
    this.batchInformation.gloss = undefined!;
    this.batchInformation.isMultipleDebits = false;
  }

  handleValidateUif() {
    let regex = new RegExp('(?!.*([-,. ])\d{2})');
    if (regex.test(this.batchInformation.fundSource)) {
      //console.log('valido');
    }
  }
}

