import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TokensService } from '../../../../Services/tokens/tokens.service';
import { TokenResponse } from '../../../../Services/tokens/models/token-response';
import { TokenCredentials } from '../../../../Services/tokens/models/token-credentials';
import { NumberPadComponent } from '../number-pad/number-pad.component';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AppConfig } from '../../../../app.config';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
/* import { EventLogRequest } from 'src/app/Services/mass-payments/Models/event-log-request';
import { ParametersService } from 'src/app/Services/parameters/parameters.service';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { TokenCredentials } from 'src/app/Services/tokens/models/token-credentials';
import { TokenResponse } from 'src/app/Services/tokens/models/token-response';
import { TokensService } from 'src/app/Services/tokens/tokens.service';
import { AuthenticationService } from 'src/app/Services/users/authentication.service';
import { NumberPadComponent } from '../number-pad/number-pad.component';
import { AppConfig } from 'src/app/app.config';
 */
@Component({
  selector: 'app-token',
  standalone: false,
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
  providers: [TokensService]
})
export class TokenComponent implements OnInit {

  selectedToken: TokenResponse = new TokenResponse();
  tokens: TokenResponse[] = [];
  data: TokenCredentials;
  closed: boolean;
  @Input() isVisibleToken = false;
  @Input() disabled = false;
  @Input() isUserToken = false;
  @Input() message!: string;
  @Input() isTokenVU = false;
  @Output() onSubmit = new EventEmitter<TokenCredentials>();
  @Output() onClosed = new EventEmitter<boolean>();
  @ViewChild(NumberPadComponent) pad!: NumberPadComponent;
  eventLog = new EventLogRequest();
  maxLength: number = 0;
  visiblePass = false;

  constructor(private tokensService: TokensService, private globalService: GlobalService,private config: AppConfig,
    private paramService: ParametersService, private authenticationService: AuthenticationService) {
    this.data = new TokenCredentials();
    this.closed = true;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  showHidePassword() {
    this.visiblePass = !this.visiblePass;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisibleToken) {
      if (!this.isTokenVU){
        if (this.isUserToken) {
          this.getUserTokens();
        } else {
          this.getCompanyTokens();
        }
        this.maxLength = +this.config.getConfig('padTokenLength');
      }
      else if(this.isTokenVU){
        this.data.name = 'TokenVU';
        this.maxLength = +this.config.getConfig('padTokenVULength')
      }
    }
  }

  handleKeyPad($event: string) {
    this.data.code = $event;
  }

  handleSubmit() {
    this.onSubmit.emit(this.data);
    this.resetPad();
  }

  handleTokenListChanged() {
    this.data.name = this.selectedToken.name;
  }

  handleClosed() {
    this.data.code = '';
    this.onClosed.emit(true);
    this.resetPad();
  }

  getCompanyTokens() {
    this.tokensService.getCompanyTokens().subscribe({next: response =>
      this.setResponseData(response),
      error: _err => this.globalService.danger("Tokens", _err.message)});
  }

  getUserTokens() {
    this.tokensService.getUserTokens().subscribe({next: response => this.setResponseData(response),
    error: _err => this.globalService.danger("Tokens", _err.message)});
  }

  setResponseData(response: TokenResponse[]) {
    this.tokens = response;
    this.selectedToken = this.tokens[0];
    this.data.name = this.selectedToken.name;
  }

  resetPad() {
    this.pad.resetPad();
  }

  changeEventLogToken(tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      switch(tipo) {
          case 1:
              this.eventLog.eventName = "Seleccion Numero Token";
              this.eventLog.eventType = "select";
              break;
          case 2:
              this.eventLog.eventName = "Click Enviar Token";
              this.eventLog.eventType = "button";
              break;
          case 3:
              this.eventLog.eventName = "Click Cancelar Token";
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
