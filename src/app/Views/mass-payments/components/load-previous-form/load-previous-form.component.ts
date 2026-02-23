import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { MassivePaymentsPreviousFormResult } from '../../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';

@Component({
  selector: 'app-load-previous-form',
  standalone: false,
  templateUrl: './load-previous-form.component.html',
  styleUrls: ['./load-previous-form.component.css']
})
export class LoadPreviousFormComponent implements OnInit, OnChanges {

  selectedSpreadsheet: MassivePaymentsPreviousFormResult = new MassivePaymentsPreviousFormResult();
  @Input() disabled = false;
  @Input() previousForm!: MassivePaymentsPreviousFormResult[];
  @Input() accountDto!: AccountDto;
  @Output() onChange: EventEmitter<MassivePaymentsPreviousFormResult> = new EventEmitter();
  eventLog = new EventLogRequest();

  constructor(private paramService: ParametersService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
  }

  clickEventLogPrevious(tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      switch(tipo) {
        case 1:
          this.eventLog.eventName = "Seleccion Planilla anterior";
          this.eventLog.eventType = "select";
          break;
        case 2:
          this.eventLog.eventName = "Click Cargar Planilla Anterior";
          this.eventLog.eventType = "button";
          break;
      }
      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.previousForm !== undefined && !changes.previousForm.isFirstChange() && changes.previousForm) {
      this.selectedSpreadsheet = this.previousForm[0];
    }
  }

  handleSelectSpreadsheet() {
    this.onChange.emit(this.selectedSpreadsheet);
  }
}
