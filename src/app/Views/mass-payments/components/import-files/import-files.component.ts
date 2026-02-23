import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { EventLogRequest } from 'src/app/Services/mass-payments/Models/event-log-request';
import { ParametersService } from 'src/app/Services/parameters/parameters.service';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { AuthenticationService } from 'src/app/Services/users/authentication.service'; */

@Component({
  selector: 'app-import-files',
  standalone: false,
  templateUrl: './import-files.component.html',
  styleUrls: ['./import-files.component.css']
})
export class ImportFilesComponent implements OnInit {
  file: FormData = new FormData();
  nameFile: string;
  @Input() disabled = false;
  @Input() operationType!: number;
  @Input() accountDto!: AccountDto;
  @Output() action = new EventEmitter();
  isValid = false;
  eventLog = new EventLogRequest();
  constructor(private messageService: GlobalService,
      private paramService: ParametersService, private authenticationService: AuthenticationService) {
      this.nameFile = 'No se eligió ningún archivo';
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

  changeEventLogImport(tipo: number) {
      if (localStorage.getItem('operationType') == "24") {
          switch(tipo) {
              case 1:
                  this.eventLog.eventName = "Click Examinar archivo Importar";
                  this.eventLog.eventType = "input file";
                  break;
              case 2:
                  this.eventLog.eventName = "Click Cargar planilla Importar";
                  this.eventLog.eventType = "button";
                  break;
              case 3:
                  this.eventLog.eventName = "Descargar XLS";
                  this.eventLog.eventType = "link";
                  break;
              case 4:
                  this.eventLog.eventName = "Descarga TXT";
                  this.eventLog.eventType = "link";
                  break;
          }

          this.eventLog.previousData = "";
          this.eventLog.updateData = "";

          this.paramService.saveEventLog(this.eventLog).subscribe();
      }
  }

  handleSendFile() {
      if (this.isValid) {
          this.action.emit(this.file);
      } else {
          return this.messageService.info('Ningúna archivo selecionado:', 'Seleccione un archivo porfavor');
      }
  }
  onFileChange($event: any) {
      if ($event.target.files && $event.target.files.length > 0) {
          if (this.file.set !== undefined) {
              this.file.set('File', $event.target.files[0]);
              this.nameFile = $event.target.files[0].name;
              this.isValid = true;
          } else if (this.file.set === undefined) {
              this.file.append('File', $event.target.files[0]);
              this.nameFile = $event.target.files[0].name;
              this.isValid = true;
          }
      }
  }
}

