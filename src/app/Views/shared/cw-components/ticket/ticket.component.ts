import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { AuthenticationService } from 'src/app/Services/users/authentication.service';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ProcessBatchDto } from '../../../../Services/shared/models/process-batch';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { TicketDto } from '../../../../Services/tickets/models/ticket-dto';
import { TicketsService } from '../../../../Services/tickets/tickets.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  providers: [TicketsService, ParametersService, UtilsService]
})
export class TicketComponent implements OnInit, OnChanges {

  ticketRequired = false;
  wasTicketObtained: boolean = false;
  @Input() amount!: number;
  @Input() batchInformation!: ProcessBatchDto;
  @Input() accountDto!: AccountDto;
  @Input() isFutureDate = false;
  @Input() amountLimitTicket!: number;
  @Input() disabled!: boolean;
  @Input() isDefaultAmountLimit = true;
  @Input() isExteriorTransfer = false;
  @Input() transferAbroadTick = false;
  @ViewChild('formTicket') form!: NgForm;
  eventLog = new EventLogRequest();
  validateTicket = false;

  constructor(private ticketsService: TicketsService, private globalService: GlobalService, private parametersService: ParametersService,
    private utilsService: UtilsService, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    if (this.isDefaultAmountLimit) {
      this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TMON', code: 'L' }))
        .subscribe({next: response => this.amountLimitTicket = +response.value});
        this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TICKET', code: 'MDD' }))
        .subscribe({next: response => this.validateTicket = response.value == 'A'});
    }
    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
  }

  changeEventPreferencialTicket(tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      switch(tipo) {
        case 1:
          this.eventLog.eventName = "Click Obtener Ticket Preferencial";
          this.eventLog.eventType = "button";
          this.eventLog.previousData = "";
          this.eventLog.updateData = "";
          break;
        case 2:
          this.eventLog.eventName = "Click Modificar Ticket Preferencial";
          this.eventLog.eventType = "button";
          this.eventLog.previousData = "";
          this.eventLog.updateData = "";
          break;
        case 3:
          this.eventLog.eventName = "Ingreso Datos Ticket Preferencial";
          this.eventLog.eventType = "input";
          this.eventLog.previousData = "";
          this.eventLog.updateData = this.batchInformation.numberTicket!.toString();
          break;
      }

      this.parametersService.saveEventLog(this.eventLog).subscribe();
    }
  }

  ngOnChanges(changes: any) {
    if ((changes.amount !== undefined && !changes.amount.isFirstChange())) {
      this.modifyTicket();
    }
  }

  getTicket() {
    const ticketDto = new TicketDto({
      amount: this.batchInformation.amount,
      sourceCurrency: this.batchInformation.sourceCurrency,
      destinationCurrency: this.batchInformation.currency,
      isExteriorTransfer: this.isExteriorTransfer,
    });
    this.ticketsService.getGMESATicket(ticketDto)
      .subscribe({next: response => {
        this.batchInformation.numberTicket = response.ticket;
        this.wasTicketObtained = this.batchInformation.isTicket = true;
        this.batchInformation.indicatorBuyOrSale = response.operationType;
        this.batchInformation.preferentialExchange = response.exchangeRate;
        this.globalService.info('Ticket obtenido', response.responseMessage);
      }, error: _err => this.globalService.warning('Servicio Mesa de Dinero', _err.message)});
  }

  modifyTicket() {
    this.batchInformation.indicatorBuyOrSale = '';
    this.wasTicketObtained = this.batchInformation.isTicket = false;
    this.batchInformation.numberTicket = null!;
    this.batchInformation.preferentialExchange = 0;
  }

  verifyTicket(): boolean {
    if (this.batchInformation.sourceCurrency === this.batchInformation.currency) {
      this.modifyTicket();
    }
    return !this.wasTicketObtained;
  }

  isTicketRequired(): boolean {
    const amountToVerify = this.batchInformation.currency === Constants.currencyBol ? this.utilsService.changeAmountBolToUsd(this.batchInformation.amount) : this.batchInformation.amount;
    return amountToVerify > this.amountLimitTicket && this.batchInformation.currency !== this.batchInformation.sourceCurrency;
  }

  handleTextTicketChanged() {
    this.batchInformation.isTicket = this.batchInformation.numberTicket! > 0;
  }

  handleValidate(): boolean {
    if (this.isTicketRequired()) {
      this.globalService.validateAllFormFields(this.form.form);
      return this.batchInformation.numberTicket ? true : false;
    }
    return true;
  }
}
