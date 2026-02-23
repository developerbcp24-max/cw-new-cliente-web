import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { DecimalPipe } from '@angular/common';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { ErrorDetailResult } from 'src/app/Services/mass-payments/Models/error-detail-result';
import { EventLogRequest } from 'src/app/Services/mass-payments/Models/event-log-request';
import { ParametersService } from 'src/app/Services/parameters/parameters.service';
import { AuthenticationService } from 'src/app/Services/users/authentication.service'; */

@Component({
  selector: 'app-amount-account-verificated',
  standalone: false,
  templateUrl: './amount-account-verificated.component.html',
  styleUrls: ['./amount-account-verificated.component.css']
  //providers: [DecimalPipe]
})
export class AmountAccountVerificatedComponent implements OnInit, OnChanges {
  @Input() totalErrors = 0;
  @Input() totalCorrects = 0;
  @Input() amount!: number;
  @Input() amounts: number[] = [];
  @Input() currency!: string;
  @Output() onAddRow = new EventEmitter();
  @Input() isVisibleButton = true;
  @Input() haveErrors = false;
  @Input() errorsDetail!: ErrorDetailResult[];
  @Input() accountDto!: AccountDto;
  errorsDetailTotal: ErrorDetailResult[] = [];
  errorsDetailResult: ErrorDetailResult[] = [];
  modalErrors = false;
  totalAmount!: number;
  totalCurrency!: string;
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 10;
  totalItems!: number;
  eventLog = new EventLogRequest();

  constructor(private cdRef: ChangeDetectorRef, private paramService: ParametersService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges(): void {
    this.setTotalAmount();
    this.handleChangePagination(1);
  }

  setTotalAmount() {
    this.totalCurrency = ''  ;
    if (this.amount >= 0) {
      this.amounts = [];
    }
    if (this.amounts.length === 0 && this.amount) {
      this.amounts.push(this.amount);
    }
    if (this.amounts && this.currency) {
      this.totalAmount = this.amounts.reduce((a, b) => (+a) + (+b), 0);
      if (this.currency === 'DOL' || this.currency === 'USD'){
        this.totalCurrency = '$us';
      }else if (this.currency === 'BOL'){
        this.totalCurrency =  'Bs';
      }
    } else {
      this.totalAmount = 0;
      this.totalCurrency = '';
    }
    this.errorsDetailTotal = this.errorsDetail;
    this.errorsDetailResult = this.errorsDetail;
    this.totalItems = this.errorsDetailTotal.length;
  }

  handleAddRow() {
    this.onAddRow.emit();
  }

  clickEventLogAddRow() {
    if (localStorage.getItem('operationType') == "24") {
      this.eventLog.userName = sessionStorage.getItem('userActual')!;
      this.eventLog.module = "Credinet Web Cliente";
      this.eventLog.event = "Pagos Masivos";
      this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
      this.eventLog.browserAgentVersion = this.authenticationService.browser;
      this.eventLog.sourceIP = this.authenticationService.ipClient;
      this.eventLog.eventName = "Click Agregar fila planilla manual";
      this.eventLog.eventType = "button";
      this.eventLog.previousData = "";
      this.eventLog.updateData = "";
      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  handleChangePagination($event: number) {
    this.errorsDetail = this.errorsDetailResult.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handleChangePagination(0);
  }
}
