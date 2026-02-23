import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MonthsResult } from '../../../../Services/parameters/models/months-result';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-select-month',
  standalone: false,
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.css']
})

export class SelectMonthComponent implements OnInit, OnChanges {
  currentDate!: Date;
  newDate: string;
  monthYear: MonthsResult = new MonthsResult();
  arrayMonths: any = [];

  @Output() onChangeFilter = new EventEmitter<MonthsResult>();
  @Input() numberMonths = 12;
  @Input() isVisibleSelected = false;
  @Input() isVisibleAllMonths = false;
  @Input() selectText: string;
  @Input() typeFilter: any;

  constructor() {
    this.newDate = '';
    this.selectText = 'Selecciona el mes a consultar';
 }

  ngOnInit() {
    this.currentDate = new Date();
    if (this.isVisibleSelected === false) {
      this.newDate = moment(this.currentDate).format('YYYY-MM');
      this.monthYear.monthYear = this.newDate;
    }
    this.handleMonths();
    this.onChangeFilter.emit(this.monthYear);
  }

  handleMonths() {
    moment.lang('es');
    for (let i = 0; i < this.numberMonths; i++) {
      let numberMonth = moment().subtract(i, 'month').format('YYYY-MM');
      let literalMonth = moment().subtract(i, 'month').format('MMMM YYYY');
      this.arrayMonths.push({ month: numberMonth, descriptionMonth: literalMonth });

    }
  }

  ngOnChanges() {
    this.onChangeMonth();
  }

  onChangeMonth() {
    this.monthYear.monthYear = this.newDate;
    this.onChangeFilter.emit(this.monthYear);
  }

}
