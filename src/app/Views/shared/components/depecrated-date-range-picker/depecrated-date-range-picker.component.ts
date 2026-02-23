import { Component, OnInit, forwardRef, ViewChild, Input, OnChanges } from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { NgForm, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
import moment, { Moment } from 'moment';
import { DateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-depecrated-date-range-picker',
  standalone: false,
  templateUrl: './depecrated-date-range-picker.component.html',
  styleUrls: ['./depecrated-date-range-picker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DepecratedDateRangePickerComponent),
    multi: true
  }]
})
export class DepecratedDateRangePickerComponent implements OnInit, OnChanges, ControlValueAccessor {

  dateRange: DateRangeModel = new DateRangeModel();
  dateInit: IMyDateModel = { date: null!, jsdate: null!, formatted: '', epoc: 0 };
  dateEnd: IMyDateModel = { date: null!, jsdate: null!, formatted: '', epoc: 0 };
  @Input() disabled = false;
  @Input() options: OptionsDateRange = new OptionsDateRange();
  @Input() optionsGrid: number[] = [3, 3, 3, 3];
  @ViewChild('dateRangeForm') form!: NgForm;

  public optionsInit!: IMyDpOptions;
  public optionsEnd!: IMyDpOptions;
  constructor(private globalService: GlobalService, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {

  }

  ngOnChanges(): void {
    if (this.options) {
      let disabledDate = moment(new Date()).add(1, 'd').toDate();
      let disabledDateUntil = moment(new Date()).add(1, 'd').toDate();
      let isDisabledSince = false;
      let isDisabledUntil = false;

      if (this.options.isMaxDateNow) {
        isDisabledSince = true;
      }

      if (this.options.minDate && this.options.maxDate) {
        isDisabledUntil = true;
        disabledDate = this.options.maxDate;
        disabledDateUntil = this.options.minDate;
      }

      this.optionsInit = {
        editableDateField: false,
        openSelectorOnInputClick: true,
        dateFormat: 'dd/mm/yyyy',
        inline: false,
        showClearDateBtn: this.options.showClearDate,
        disableSince: isDisabledSince
          ? { year: disabledDate.getFullYear(), month: disabledDate.getMonth() + 1, day: disabledDate.getDate() }
          : { year: 0, month: 0, day: 0 },
        disableUntil: isDisabledUntil
          ? { year: disabledDateUntil.getFullYear(), month: disabledDateUntil.getMonth() + 1, day: disabledDateUntil.getDate() }
          : { year: 0, month: 0, day: 0 }
      };

      this.optionsEnd = {
        editableDateField: false,
        openSelectorOnInputClick: true,
        dateFormat: 'dd/mm/yyyy',
        inline: false,
        showClearDateBtn: this.options.showClearDate,
        disableSince: isDisabledSince
          ? { year: disabledDate.getFullYear(), month: disabledDate.getMonth() + 1, day: disabledDate.getDate() }
          : { year: 0, month: 0, day: 0 },
        disableUntil: isDisabledUntil
          ? { year: disabledDateUntil.getFullYear(), month: disabledDateUntil.getMonth() + 1, day: disabledDateUntil.getDate() }
          : { year: 0, month: 0, day: 0 }
      };
    }
  }

  writeValue(obj: any): void {
    if (obj) {
      this.dateRange = obj;
      if (this.dateRange.dateInit) {
        this.dateInit.jsdate = this.dateRange.dateInit;
        this.dateInit.date = {
          year: this.dateRange.dateInit.getFullYear(),
          month: this.dateRange.dateInit.getMonth() + 1,
          day: this.dateRange.dateInit.getDate()
        };
        this.verifyRange();
      } else {
        this.dateInit = null!;
      }
      if (this.dateRange.dateEnd) {
        this.dateEnd.jsdate = this.dateRange.dateEnd;
        this.dateEnd.date = {
          year: this.dateRange.dateEnd.getFullYear(),
          month: this.dateRange.dateEnd.getMonth() + 1,
          day: this.dateRange.dateEnd.getDate()
        };
        this.verifyRange();
      } else {
        this.dateEnd = null!;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => { };

  onDateInitChanged($event: IMyDateModel | any) {
    this.dateRange.dateInit = $event;
    this.verifyRange();
    this.propagateChange(this.dateRange);
  }

  onDateEndChanged($event: IMyDateModel | any) {
    this.dateRange.dateEnd = $event;
    this.verifyRange();
    this.propagateChange(this.dateRange);
  }

  verifyRange() {
    const tempInitReal = moment(this.dateRange.dateInit ?? new Date());
    const tempEnd = moment(this.dateRange.dateEnd ?? new Date());
    if (tempInitReal.toDate() > tempEnd.toDate()) {
      this.dateRange.isValid = false;
      this.globalService.danger('Error de rango', `La fecha inicial, no puede ser mayor a la fecha final`);
      return false;
    }
    if (this.options.maxMonthRange) {
      let tempInit = moment(this.dateRange.dateInit ?? new Date()).add(this.options.maxMonthRange, 'M');
      tempInit = moment(tempInit).add(1, 'd');
      if (tempEnd.isAfter(tempInit)) {
        this.dateRange.isValid = false;
        this.globalService.danger('Error de rango', `el rango de fechas debe ser menor a ${this.options.maxMonthRange} meses`);
        return false;
      }
    }
    this.dateRange.isValid = true;
    return true;
  }
}

export class DateRangeModel {
  dateInit?: Date = new Date();
  dateEnd?: Date = new Date();
  isValid?= false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class OptionsDateRange {
  isMaxDateNow?= true;
  maxMonthRange?= 3;
  isHorizontal?= true;
  showClearDate?= false;
  minDate?: Date = null!;
  maxDate?: Date = null!;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
