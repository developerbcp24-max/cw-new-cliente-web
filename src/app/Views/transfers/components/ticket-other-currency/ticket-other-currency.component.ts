import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-ticket-other-currency',
  standalone: false,
  templateUrl: './ticket-other-currency.component.html',
  styleUrls: ['./ticket-other-currency.component.css']
})
export class TicketOtherCurrencyComponent implements OnInit, OnChanges {

  isTicketOtherCurrency: boolean;
  ticket: string;
  @Input() disabled!: false;
  @Input() amount!: number;
  @Input() isRequiredTicket: boolean;
  @Output() onChange = new EventEmitter<string>();
  @ViewChild('formTicket') form!: NgForm;

  constructor(private globalService: GlobalService) {
    this.isTicketOtherCurrency = false;
    this.ticket = '';
    this.isRequiredTicket = false;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.amount && !changes.amount.isFirstChange()) {
      if (changes.amount.currentValue === 0 || changes.amount.currentValue === '') {
        this.isTicketOtherCurrency = false;
        this.ticket = '';
        this.onChange.emit(this.ticket);
      }
    }

    if (changes.isRequiredTicket && !changes.isRequiredTicket.isFirstChange()) {
      if (changes.isRequiredTicket.currentValue) {
        this.isTicketOtherCurrency = true;
      } else {
        this.isTicketOtherCurrency = false;
      }
      this.ticket = '';
      this.onChange.emit(this.ticket);
    }
  }

  handleIsTicketOtherCurrency() {
    if (!this.isTicketOtherCurrency) {
      this.ticket = '';
    }
  }

  handleChangeTicket() {
    this.onChange.emit(this.ticket);
  }

  isValid() {
    if (this.amount && this.amount !== 0) {
      return true;
    }
    return false;
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.isTicketOtherCurrency && this.ticket === '') {
      return false;
    }
    return true;
  }
}
