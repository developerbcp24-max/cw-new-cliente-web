import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccountsService } from '../../../../Services/accounts/accounts.service';
import { BalancesAndMovementsService } from '../../../../Services/balances-and-movements/balances-and-movements.service';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { DataService } from '../../../../Services/shared/data.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { AccountIdDto } from '../../../../Services/balances-and-movements/models/account-id-dto';

@Component({
  selector: 'app-my-accounts',
  standalone: false,
  templateUrl: './my-accounts.component.html',
  styleUrls: ['./my-accounts.component.css'],
  providers: [AccountsService, BalancesAndMovementsService]
})
export class MyAccountsComponent implements OnInit, OnChanges {

  accounts: AccountResult[] = [];
  accountsUSD: AccountResult[] = [];
  accountsBOL: AccountResult[] = [];
  accountSelected: AccountResult = new AccountResult();

  @Output() onChange = new EventEmitter<AccountResult>();
  @Input() returnBalances = false;
  @Input() companyAccounts = false;
  @Input() accountRequest!: AccountDto;
  @Input() selectedAccount = 0;
  @Input() loadFirstAccount = true;
  @Input() defaultAccount = 0;
  @Input() isAwait = false;
  @Input() onlyCurrencyBOL = false;
  @Input() accountType = '';

  eventLog = new EventLogRequest();
  isValidateCurreny = false;
  isLoadingBalance = false;

  constructor(
    private accountService: AccountsService,
    private balancesAndMovementsService: BalancesAndMovementsService,
    private dataService: DataService,
    private authenticationService: AuthenticationService,
    private parametersService: ParametersService
  ) { }

  ngOnInit() {
    if (!this.isAwait) {
      this.getAccounts();

      // Events
      this.eventLog.userName = sessionStorage.getItem('userActual')!;
      this.eventLog.module = "Credinet Web Cliente";
      this.eventLog.event = "Pagos Masivos";
      this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
      this.eventLog.browserAgentVersion = this.authenticationService.browser;
      this.eventLog.sourceIP = this.authenticationService.ipClient;
    }
  }

  getAccounts() {
    if (this.companyAccounts) {
      if (this.accountRequest !== undefined) {
        this.accountService.getCompanyAccounts(this.accountRequest)
          .subscribe({
            next: response => {
              this.parseAccount(response);
            },
            error: err => {
              ////console.error('Error al obtener cuentas de empresa:', err);
              this.accounts = [];
              this.dataService.noAccounts = true;
            }
          });
      }
    } else {
      if (this.accountRequest !== undefined) {
        this.accountService.getAccounts(this.accountRequest)
          .subscribe({
            next: response => {
              this.parseAccount(response);
            },
            error: err => {
              ////console.error('Error al obtener cuentas:', err);
              this.accounts = [];
              this.dataService.noAccounts = true;
            }
          });
      }
    }
  }

  public parseAccount(response: AccountResult[]) {
    // Asegurar que response no sea null o undefined
    this.accounts = this.accountsBOL = this.accountsUSD = response || [];

    if (this.accountType !== '') {
      this.accounts = this.accounts.filter(cuenta => cuenta.currency === this.accountType);
    }

    if (response && response.length > 0) {
      if (this.defaultAccount > 0) {
        const foundAccount = this.accounts.find(x => x.id?.toString() === this.defaultAccount.toString());
        if (foundAccount) {
          this.accountSelected = foundAccount;
          this.getBalance(this.accountSelected);
          this.onChange.emit(this.accountSelected);
        } else {
          // Si no se encuentra la cuenta por defecto, seleccionar la primera si loadFirstAccount es true
          if (this.loadFirstAccount && this.accounts.length > 0) {
            this.accountSelected = this.accounts[0];
            this.getBalance(this.accountSelected);
            this.onChange.emit(this.accountSelected);
          }
        }
      } else {
        if (this.loadFirstAccount) {
          this.accountSelected = this.accounts[0];
          this.getBalance(this.accountSelected);
          this.onChange.emit(this.accountSelected);
        } else {
          this.accountSelected = null!;
          this.onChange.emit(this.accountSelected);
        }
      }
    } else {
      this.dataService.noAccounts = true;
      this.accountSelected = null!;
      this.onChange.emit(this.accountSelected);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (changes['defaultAccount'] !== undefined && !changes['defaultAccount'].isFirstChange()) {
        const foundAccount = this.accounts.find(x =>
          x.id?.toString() === changes['defaultAccount'].currentValue?.toString()
        );
        if (foundAccount) {
          this.accountSelected = foundAccount;
          this.handleAccountChanged();
        }
      }
    });
  }

  handleAccountChanged() {
    // Validar que accountSelected existe y tiene un ID válido
    if (this.accountSelected && this.accountSelected.id) {
      this.getBalance(this.accountSelected);
      this.onChange.emit(this.accountSelected);
    }
  }

  changeEventLogAccount(event: any) {
    if (this.accountRequest !== undefined && this.accountRequest?.operationTypeId !== undefined) {
      if (this.accountRequest?.operationTypeId[0] === 24) {
        this.eventLog.eventName = "Seleccion de cuenta origen";
        this.eventLog.eventType = event.target.localName;
        this.eventLog.previousData = "";
        this.eventLog.updateData = this.accountSelected?.formattedNumber || '';
        this.parametersService.saveEventLog(this.eventLog).subscribe({
          next: () => {
            // Log guardado exitosamente
          },
          error: err => {
            ////console.error('Error al guardar log de evento:', err);
          }
        });
      }
    }
  }

  setAccount(accountId: string) {
    const foundAccount = this.accounts.find(x => x.id?.toString() === accountId);
    if (foundAccount) {
      this.accountSelected = foundAccount;
      this.getBalance(this.accountSelected);
      this.onChange.emit(this.accountSelected);
    }
  }

  getBalance(account: AccountResult) {
    // Validar que account existe y tiene un ID
    if (!account || !account.id) {
      ////console.warn('Cuenta no válida para obtener balance');
      return;
    }

    const accountId: AccountIdDto = new AccountIdDto({ accountId: account.id });

    if (this.returnBalances) {
      this.isLoadingBalance = true;

      this.balancesAndMovementsService
        .getAccountBalancesById(accountId)
        .subscribe({
          next: (response: AccountResult) => {
            // Verificar que response no sea null antes de acceder a sus propiedades
            if (response) {
              this.accountSelected.availableBalance = response.availableBalance;
              this.accountSelected.overdraftAmount = response.overdraftAmount;
              this.accountSelected.overdraftBalance = response.overdraftBalance;
              this.accountSelected.owner = response.owner;
              this.accountSelected.documentAccount = response.documentAccount;
              // Limpiar mensaje de error si existía
              this.accountSelected.balanceErrorMessage = undefined;
            } else {
              // Manejar el caso cuando response es null
              this.accountSelected.balanceErrorMessage = 'No se pudo obtener la información de la cuenta';
              ////console.warn('Respuesta nula al obtener balance para cuenta:', account.id);
            }
            this.isLoadingBalance = false;
          },
          error: err => {
            this.accountSelected.balanceErrorMessage = err.message || 'Error al obtener el saldo de la cuenta';
            ////console.error('Error al obtener balance:', err);
            this.isLoadingBalance = false;
          }
        });
    }
  }
}
