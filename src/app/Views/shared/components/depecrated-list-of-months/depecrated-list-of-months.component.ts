import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { MonthsResult } from '../../../../Services/parameters/models/months-result';
import { MonthsQuantityDto } from '../../../../Services/parameters/models/months-quantity-dto';

@Component({
  selector: 'app-depecrated-list-of-months',
  standalone: false,
  templateUrl: './depecrated-list-of-months.component.html',
  styleUrls: ['./depecrated-list-of-months.component.css'],
  providers: [ParametersService]
})
export class DepecratedListOfMonthsComponent implements OnInit {

  months: MonthsResult[] = [];
  selectedMonth!: MonthsResult;
  disabled = false;
  @Input() quantity!: number;
  @Input() isOptionAllVisible = false;
  @Input() isFirstMonthSelected = false;
  @Output() onChange = new EventEmitter<MonthsResult>();
  @Input() optionText: string;
  @ViewChild('monthListForm') form!: NgForm;

  constructor(private parametersService: ParametersService, private globalService: GlobalService) {
    this.optionText = 'Seleccione el mes';
  }

  ngOnInit() {
    this.parametersService.getMonths(new MonthsQuantityDto({ quantity: this.quantity }))
      .subscribe({next: response => {
        this.months = response;
        if (this.isFirstMonthSelected) {
          this.selectedMonth = this.months[0];
        }
      }, error: _err => this.globalService.danger('Parámetros', _err.message)});
  }

  handleCaptureMonth() {
    if (!this.selectedMonth.description) {
      this.onChange.emit(new MonthsResult({
        initial: this.months[this.months.length - 1].initial,
        final: this.months[0].final,
        description: this.months[this.months.length - 1].description + ' a ' + this.months[0].description
      }));
    } else {
      this.onChange.emit(this.selectedMonth);
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

}
