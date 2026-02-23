import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { MassPaymentFavoriteTransactions } from '../../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';

@Component({
  selector: 'app-favorite-transactions',
  standalone: false,
  templateUrl: './favorite-transactions.component.html',
  styleUrls: ['./favorite-transactions.component.css']
})
export class FavoriteTransactionsComponent implements OnInit, OnChanges {

  selectedFavorite!: MassPaymentFavoriteTransactions;
  @Input() favoriteTransactions!: MassPaymentFavoriteTransactions[];
  @Input() disabled = false;
  @Input() accountDto!: AccountDto;
  @Output() onChange: EventEmitter<MassPaymentFavoriteTransactions> = new EventEmitter();
  @ViewChild('favoriteTransactionForm') form!: NgForm;
  eventLog = new EventLogRequest();

  constructor(private globalService: GlobalService,
    private paramService: ParametersService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.favoriteTransactions && !changes.favoriteTransactions.isFirstChange()) {
      this.selectedFavorite = undefined!;
    }
  }

  handleLoad() {
    this.selectedFavorite.operation = Operation.load;
    this.onChange.emit(this.selectedFavorite);
  }

  changeEventLogFavorito(tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      switch(tipo) {
        case 1:
          this.eventLog.eventName = "Click Cargar planilla Favorita";
          this.eventLog.eventType = "button";
          break;
        case 2:
          this.eventLog.eventName = "Click Eliminar planilla Favorita";
          this.eventLog.eventType = "button";
          break;
        case 3:
          this.eventLog.eventName = "Seleccion Planilla Favorita";
          this.eventLog.eventType = "select";
          break;
      }

      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  handleUpdate() {
    this.selectedFavorite.operation = Operation.update;
    this.onChange.emit(this.selectedFavorite);
  }

  handleRemove() {
    this.selectedFavorite.operation = Operation.remove;
    this.onChange.emit(this.selectedFavorite);
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }
}
