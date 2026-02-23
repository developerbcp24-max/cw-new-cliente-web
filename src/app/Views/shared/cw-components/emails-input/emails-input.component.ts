import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProcessBatchDto } from '../../../../Services/shared/models/process-batch';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { EventLogRequest } from 'src/app/Services/mass-payments/Models/event-log-request';
import { ParametersService } from 'src/app/Services/parameters/parameters.service';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { ProcessBatchDto } from 'src/app/Services/shared/models/process-batch';
import { AuthenticationService } from 'src/app/Services/users/authentication.service'; */

@Component({
  selector: 'app-emails-input',
  standalone: false,
  templateUrl: './emails-input.component.html',
  styleUrls: ['./emails-input.component.css'],
})
export class EmailsInputComponent implements OnInit {

  @Input() disabled = false;
  @Input() batchInformation!: ProcessBatchDto | any;
  @Input() accountDto!: AccountDto;
  @ViewChild('emailForm') form!: NgForm;
  eventLog = new EventLogRequest();

  constructor(private globalService: GlobalService,
    private authenticationService: AuthenticationService,
    private paramService: ParametersService) {
  }

  ngOnInit() {
    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
  }

  handleValidate() {
    if (!this.batchInformation.sendVouchers || this.batchInformation.sendVouchers === '') {
      return true;
    }
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

  blurEventLogEmails() {
    if (localStorage.getItem('operationType') == "24") {
      this.eventLog.eventName = "Ingreso de datos de Correos Principal";
      this.eventLog.eventType = "textarea";
      this.eventLog.previousData = "";
      this.eventLog.updateData = this.batchInformation.sendVouchers;

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }
}
