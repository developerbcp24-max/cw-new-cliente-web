import { AfterContentInit, Component, EventEmitter, Output, Input, QueryList, ContentChildren } from '@angular/core';
//import { AuthenticationService } from 'src/app/Services/users/authentication.service';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ButtonGroupContentComponent } from '../button-group-content/button-group-content.component';
import { AuthenticationService } from '../../../../Services/users/authentication.service';

@Component({
  selector: 'app-button-group',
  standalone: false,
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements AfterContentInit {
  @Input() accountDto!: AccountDto;
  @Output() onChange: EventEmitter<number> = new EventEmitter();
  @Output() onChangeCode: EventEmitter<any> = new EventEmitter();
  @ContentChildren(ButtonGroupContentComponent)contents!: QueryList<ButtonGroupContentComponent>;
  contentSelected = new ButtonGroupContentComponent();
  eventLog = new EventLogRequest();

  constructor(private authenticationService: AuthenticationService, private paramService: ParametersService) { }

  ngAfterContentInit() {
    if (this.contents.filter(x => x.active).length === 0) {
      this.selectContent(this.contents.first);
    }
  }

  selectContent(content: any) {
    if (content === undefined) {
      content = this.contents.first;
    }
    this.contentSelected = content;
    const result = this.contents.toArray();
    result.forEach(x => x.active = false);
    content.active = true;
    content.index = result.findIndex(x => x.active);
    this.onChange.emit(content.index);
    if (content.code != undefined || content.code != null || content.code != '') {
      this.onChangeCode.emit(content.code);
    }
    this.clickEventLogPlanilla(content.title);
  }

  clickEventLogPlanilla(boton: string) {
    if (localStorage.getItem('operationType') == "24") {
      this.eventLog.userName = sessionStorage.getItem('userActual')!;
      this.eventLog.module = "Credinet Web Cliente";
      this.eventLog.event = "Pagos Masivos";
      this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
      this.eventLog.browserAgentVersion = this.authenticationService.browser;
      this.eventLog.sourceIP = this.authenticationService.ipClient;

      this.eventLog.eventName = "Click " + boton;
      this.eventLog.eventType = "button";
      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }
}
