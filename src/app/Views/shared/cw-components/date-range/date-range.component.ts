import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  forwardRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
//import moment, { Moment } from 'moment';
import moment, { Moment } from 'moment';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {GlobalService} from '../../../../Services/shared/global.service';
import {NG_VALUE_ACCESSOR, NgForm, FormControl} from '@angular/forms';
import {MatCalendarCellClassFunction, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

const ERROROUTOFLIMIT = 'La Fecha seleccionada se encuentra fuera de los límites establecidos';
const ERRORSTARTNOTBELONGEREND = 'La Fecha Inicial no debe superar a la Fecha Final';

@Component({
  selector: 'app-date-range',
  standalone: false,
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateRangeComponent),
    multi: true,

  },
    {provide: MAT_DATE_LOCALE, useValue: 'es-GB'}
  ]
})

export class DateRangeComponent implements OnInit, OnChanges {
  public errorMessage: string = '';
  public showError: boolean = false;
  public today: Date = new Date();
  @Input() startDateName = 'Fecha Inicial :';
  @Input() endDateName = 'Fecha Final : ';
  @Input() isVisibleStartDate = true;
  @Input() isVisibleEndDate = true;

  dateRange: DateRangeModel = new DateRangeModel();
  dateInit: IMyDateModel = {date: null!, jsdate: null!, formatted: '', epoc: 0};
  dateEnd: IMyDateModel = {date: null!, jsdate: null!, formatted: '', epoc: 0};
  @Input() historical__box = 'historical__box';
  @Input() disabled = false;
  @Input() options: OptionsDateRange = new OptionsDateRange();
  @Input() optionsGrid: number[] = [3, 3, 3, 3];
  @ViewChild('dateRangeForm') form!: NgForm;

  public optionsInit!: IMyDpOptions | MatDatepickerInputEvent<Date>;
  public optionsEnd!: IMyDpOptions;

  public date = new FormControl(new Date());
  public serializedDate = new FormControl((new Date()).toISOString());

  @Input() DateMin: any = Date.now();

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
          ? {year: disabledDate.getFullYear(), month: disabledDate.getMonth() + 1, day: disabledDate.getDate()}
          : {year: 0, month: 0, day: 0},
        disableUntil: isDisabledUntil
          ? {
            year: disabledDateUntil.getFullYear(),
            month: disabledDateUntil.getMonth() + 1,
            day: disabledDateUntil.getDate()
          }
          : {year: 0, month: 0, day: 0}
      };

      this.optionsEnd = {
        editableDateField: false,
        openSelectorOnInputClick: true,
        dateFormat: 'dd/mm/yyyy',
        inline: false,
        showClearDateBtn: this.options.showClearDate,
        disableSince: isDisabledSince
          ? {year: disabledDate.getFullYear(), month: disabledDate.getMonth() + 1, day: disabledDate.getDate()}
          : {year: 0, month: 0, day: 0},
        disableUntil: isDisabledUntil
          ? {
            year: disabledDateUntil.getFullYear(),
            month: disabledDateUntil.getMonth() + 1,
            day: disabledDateUntil.getDate()
          }
          : {year: 0, month: 0, day: 0}
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

  propagateChange = (_: any) => {
  };

  onDateInitChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateRange.dateInit = event.value!;
    this.verifyRange();
    this.propagateChange(this.dateRange);
    return '';
  }

  onDateEndChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateRange.dateEnd = event.value!;
    this.verifyRange();
    this.propagateChange(this.dateRange);
  }

  verifyRange() {
    this.showError = false;
    const tempInitReal = this.dateRange.dateInit ? moment(this.dateRange.dateInit) : moment.invalid();
    const tempEnd = this.dateRange.dateEnd ? moment(this.dateRange.dateEnd) : moment.invalid();
    if (tempInitReal.isValid() && tempEnd.isValid() && tempInitReal.toDate() > tempEnd.toDate()) {
      this.dateRange.isValid = false;
      this.showError = true;
      this.errorMessage = 'Error de rango, La fecha inicial, no puede ser mayor a la fecha final';
      return false;
    }
    if (this.options.maxMonthRange) {
      let tempInit: Moment;
      if (this.dateRange.dateInit) {
        tempInit = moment(this.dateRange.dateInit).add(this.options.maxMonthRange, 'M');
        tempInit = tempInit.add(1, 'd');
        if (tempEnd.isAfter(tempInit)) {
          this.dateRange.isValid = false;
          this.showError = true;
          this.errorMessage = 'Error de rango, el rango de fechas debe ser menor a ' + this.options.maxMonthRange + ' meses';
          return false;
        }
      }
    }
    if (<number><any>(this.dateRange.dateInit == null) ^ <number><any>(this.dateRange.dateEnd == null)) {
      this.dateRange.isValid = false;
      this.showError = true;
      this.errorMessage = 'Ambas fechas deben ser seleccionadas.';
      return false;
    }
    this.dateRange.isValid = true;
    return true;
  }
}

export class DateRangeModel {
  dateInit?: Date = new Date();
  dateEnd?: Date = new Date();
  isValid? = false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class OptionsDateRange {
  isMaxDateNow? = true;
  maxMonthRange? = 3;
  isHorizontal? = true;
  showClearDate? = false;
  minDate?: Date = null!;
  maxDate?: Date = null!;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
