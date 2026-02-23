import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';
import { TicketModel } from '../../../../Services/shared/models/ticket-model';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { TicketDto } from '../../../../Services/tickets/models/ticket-dto';
import { TicketResult } from '../../../../Services/tickets/models/ticket-result';
import { TicketsService } from '../../../../Services/tickets/tickets.service';

@Component({
  selector: 'app-depecrated-ticket',
  standalone: false,
  templateUrl: './depecrated-ticket.component.html',
  styleUrls: ['./depecrated-ticket.component.css'],
  providers: [TicketsService, ParametersService, UtilsService]
})
export class DepecratedTicketComponent implements OnInit, OnChanges {

  ticketModel: TicketModel = new TicketModel();
  ticketRequired = false;
  @Input() isFutureDate = false;
  @Input() amountLimitTicket!: number;
  @Input() amount!: number;
  @Input() sourceCurrency!: string;
  @Input() destinationCurrency!: string;
  @Input() disabled!: boolean;
  @Input() isDefaultAmountLimit = true;
  @Output() onChange = new EventEmitter<TicketModel>();
  @ViewChild('formTicket') form!: NgForm;

  constructor(private ticketsService: TicketsService,
    private globalService: GlobalService,
    private parametersService: ParametersService,
    private utilsService: UtilsService) {
    this.ticketModel.ticket = new TicketResult();
  }

  ngOnInit() {
    if (this.isDefaultAmountLimit) {
      this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TMON', code: 'L' }))
        .subscribe({next: response => this.amountLimitTicket = +response.value});
    }
  }

  ngOnChanges(changes: any/* SimpleChanges */) {
    if (changes.isFutureDate !== undefined && !changes.isFutureDate.isFirstChange()) {
      if (changes.isFutureDate) {
        this.ticketModel.isTicketSelected = false;
        this.modifyTicket();
      }
    }
    if ((changes.amount !== undefined && !changes.amount.isFirstChange()) ||
      (changes.destinationCurrency !== undefined && !changes.destinationCurrency.isFirstChange()) ||
      (changes.sourceCurrency !== undefined && !changes.sourceCurrency.isFirstChange())) {
      this.isTicketRequired();
      if (!this.ticketModel.isTicketSelected) {
        this.modifyTicket();
      }
    }
  }

  getTicket() {
    const { amount, sourceCurrency, destinationCurrency, ticketsService } = this;
    const ticketDto = new TicketDto({
      amount: amount,
      sourceCurrency: sourceCurrency,
      destinationCurrency: destinationCurrency,
    });
    ticketsService.getGMESATicket(ticketDto)
      .subscribe({next: response => {
        this.ticketModel.ticket = response;
        this.ticketModel.ticket.originalAmount = amount;
        this.onChange.emit(this.ticketModel);
        this.globalService.info('Ticket obtenido', this.ticketModel.ticket.responseMessage);
      }, error: _err => this.globalService.warning('Servicio Mesa de Dinero', _err.message)});
  }

  modifyTicket() {
    this.ticketModel.ticket = new TicketResult();
    this.onChange.emit(this.ticketModel);
  }

  isSelectedTicket() {
    return this.ticketModel.ticket.responseCode === 0;
  }

  isValid(): boolean {
    let valid = this.sourceCurrency !== this.destinationCurrency;
    valid = valid && this.sourceCurrency !== '';
    valid = valid && this.destinationCurrency !== '';
    valid = valid && this.amount > 0;
    if (!valid) {
      this.ticketModel.isTicketSelected = false;
    }
    return valid;
  }

  isTicketRequired() {
    const amountToVerify = this.destinationCurrency === Constants.currencyBol ? this.utilsService.changeAmountBolToUsd(this.amount) : this.amount;
    return this.ticketModel.isTicketSelected = this.ticketRequired = amountToVerify > this.amountLimitTicket;
  }

  handleChangeChecked($event: any) {
    if (!$event.currentTarget.checked) {
      this.ticketModel.ticket = new TicketResult();
      this.onChange.emit(this.ticketModel);
    }
  }

  handleValidate() {
    if (this.isFutureDate || !this.ticketModel.isTicketSelected) {
      return true;
    }
    this.globalService.validateAllFormFields(this.form.form);
    return this.ticketModel.ticket.ticket ? true : false;
  }

  handleTextTicketChange() {
    this.ticketModel.ticket.originalAmount = this.amount;
    this.onChange.emit(this.ticketModel);
  }
}
