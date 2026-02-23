import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParameterChargeResult } from '../../../../Services/transfers-abroad/models/parameter-charge-result';
import { TicketsService } from '../../../../Services/tickets/tickets.service';
import { TicketCommissionDto } from '../../../../Services/tickets/models/ticket-commission-dto';
import { TicketCommissionResult } from '../../../../Services/tickets/models/ticket-commission-result';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ticket-comission',
  standalone: false,
  templateUrl: './ticket-comission.component.html',
  styleUrls: ['./ticket-comission.component.css'],
  providers: [TicketsService]
})
export class TicketComissionComponent implements OnInit, OnChanges {
  disabled: boolean;
  request: TicketCommissionDto = new TicketCommissionDto();
  result: TicketCommissionResult = new TicketCommissionResult();
  isTicketCommission: boolean;
  isGenerate: boolean;
  ticketRequired = false;

  @Input() charges: ParameterChargeResult[] = [];
  @Input() amount!: number;
  @Input() amountLimitTicket!: number;
  @Output() onGetTicket = new EventEmitter<TicketCommissionResult>();
  @Output() onChangeCharge = new EventEmitter<string>();
  @ViewChild('formTicket') form!: NgForm;

  constructor(private transfersAbroadService: TicketsService,
    private globalService: GlobalService) {
    this.disabled = false;
    this.request.commissionCharge = 'default';
    this.isTicketCommission = false;
    this.isGenerate = false;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.amount && !changes.amount.isFirstChange()) {
      if (changes.amount.currentValue === 0 || changes.amount.currentValue === '') {
        this.isTicketCommission = false;
        this.result = new TicketCommissionResult();
      }
      this.isTicketRequired();
    }
  }

  handleGetTicketCommission() {
    if (this.request.commissionCharge === 'default') {
      this.globalService.danger('ADVERTENCIA', 'Debe seleccionar un tipo de cargo de comisión. Por favor intente nuevamente. Gracias.');
      return;
    }
    this.request.amount = this.amount;

    if (this.amount > 0) {
      this.transfersAbroadService
        .getSGMDDTicket(this.request)
        .subscribe({next: (res: TicketCommissionResult) => {
          this.isGenerate = true;
          this.result = res;
          this.globalService.info('Ticket obtenido', this.result.ticket);
          this.onGetTicket.emit(this.result);
        }});
    } else {
      this.globalService.danger('ADVERTENCIA', 'El monto debe ser mayopr a cero. Por favor intente nuevamente. Gracias.');
      return;
    }
  }

  handleIsticketCommission() {
    if (!this.isTicketCommission) {
      this.handleReset();
    }
  }

  isValid() {
    if (this.amount && this.amount !== 0) {
      return true;
    }
    return false;
  }

  handleReset() {
    this.result = new TicketCommissionResult();
    this.isGenerate = false;
    this.request.commissionCharge = 'default';
    this.onGetTicket.emit(this.result);
  }

  handleChangeCharge() {
    if (this.request.commissionCharge === 'default') {
      this.handleReset();
    } else {
      this.onChangeCharge.emit(this.request.commissionCharge);
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.request.commissionCharge !== 'default') {
      let valid = this.amount > 0;
      valid = valid && this.request.commissionCharge !== 'default';
      valid = valid && this.result.ticket.trim() !== '';
      valid = valid && this.amount > 0;
      return valid;
    }
    return true;
  }

  handleTextTicketChange() {
    this.result.originalAmount = this.amount;
    this.onGetTicket.emit(this.result);
  }

  isTicketRequired() {
    return this.isTicketCommission = this.ticketRequired = this.amount > this.amountLimitTicket;
  }

}
