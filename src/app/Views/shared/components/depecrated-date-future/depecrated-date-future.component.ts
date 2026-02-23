import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateFutureModel } from '../../../../Services/shared/models/date-future-model';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-depecrated-date-future',
  standalone: false,
  templateUrl: './depecrated-date-future.component.html',
  styleUrls: ['./depecrated-date-future.component.css'],
  providers: [UtilsService]
})
export class DepecratedDateFutureComponent implements OnInit {

  dateFuture: DateFutureModel = new DateFutureModel();
  model: any;
  @Output() onChange = new EventEmitter<DateFutureModel>();
  @Input() disabled!: boolean;
  @Input() visible: boolean;
  @ViewChild('formDateFuture') form!: NgForm;

  public options!: IMyDpOptions;

  constructor(private utilsService: UtilsService, private globalService: GlobalService) {
    this.visible = true;
    this.options = {
      editableDateField: false,
      openSelectorOnInputClick: true,
      dateFormat: 'dd/mm/yyyy',
      inline: false,
      disableUntil: this.utilsService.getToday()
    };
   }

  ngOnInit() {
    this.dateFuture.isDateFuture = false;
    this.onChange.emit(this.dateFuture);
  }

  onDateChanged($event: any) {
    this.dateFuture.date = $event;
    this.onChange.emit(this.dateFuture);
  }

  handleChangeChecked($event: boolean) {
    if (!$event) {
      this.model = null;
    }
    this.dateFuture.date = undefined!;
    this.onChange.emit(this.dateFuture);
  }

  handleValidate() {
    if (this.visible && !this.dateFuture.isDateFuture) {
      return true;
    }
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }
}
