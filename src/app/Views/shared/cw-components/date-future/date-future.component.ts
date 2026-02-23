import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
//import moment, { Moment } from 'moment';
import moment, { Moment } from 'moment';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { DateFutureModel } from '../../../../Services/shared/models/date-future-model';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
/* import { EventLogRequest } from 'src/app/Services/mass-payments/Models/event-log-request';
import { ParametersService } from 'src/app/Services/parameters/parameters.service';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { DateFutureModel } from 'src/app/Services/shared/models/date-future-model';
import { UtilsService } from 'src/app/Services/shared/utils.service';
import { AuthenticationService } from 'src/app/Services/users/authentication.service'; */

@Component({
  selector: 'app-date-future',
  standalone: false,
  templateUrl: './date-future.component.html',
  styleUrls: ['./date-future.component.css'],
  providers: [UtilsService]
})
export class DateFutureComponent implements OnInit {

  dateFuture: DateFutureModel = new DateFutureModel();
  model!: Date;
  @Output() onChange = new EventEmitter<DateFutureModel>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  @Input() disabled!: boolean;
  @Input() visible: boolean;
  @ViewChild('formDateFuture') form!: NgForm;
  eventLog = new EventLogRequest();

  public options!: IMyDpOptions;

  constructor(private utilsService: UtilsService, private globalService: GlobalService, private paramService: ParametersService,
    private authenticationService: AuthenticationService) {
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

  onDateChanged($event: IMyDateModel | any): void {
    //
    this.dateFuture.date = $event;
  }

  handleChangeChecked($event: boolean) {
    if (!$event) {
      this.model = null!;
    }
    this.dateFuture.date = undefined!;
    this.onChange.emit(this.dateFuture);
  }

  handleValidate(): boolean {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid!;
  }

  handleScheduleOperation() {
    if (this.handleValidate()) {
      this.dateFuture.isDateFuture = true;
      this.dateFuture.date.setHours(7, 0, 0, 0);
      const date = moment(this.dateFuture.date).format('YYYY-MM-DD h:mm:ss a');
      this.dateFuture.dateString = date.toString();
      this.onChange.emit(this.dateFuture);
      this.visible = false;
    }
  }

  handleOnClose() {
    this.model = null!;
    this.onClose.emit(false);
  }

  changeEventLogProgramar(tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      switch(tipo) {
          case 1:
              this.eventLog.eventName = "Seleccion Fecha Programar";
              this.eventLog.eventType = "datepicker";
              break;
          case 2:
              this.eventLog.eventName = "Click Guardar Programar";
              this.eventLog.eventType = "button";
              break;
          case 3:
              this.eventLog.eventName = "Click Cancelar Programar";
              this.eventLog.eventType = "link";
              break;
      }
      // Events
      this.eventLog.userName = sessionStorage.getItem('userActual')!;
      this.eventLog.module = "Credinet Web Cliente";
      this.eventLog.event = "Pagos Masivos";
      this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
      this.eventLog.browserAgentVersion = this.authenticationService.browser;
      this.eventLog.sourceIP = this.authenticationService.ipClient;

      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }
}
