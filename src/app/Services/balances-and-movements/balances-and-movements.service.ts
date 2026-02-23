import { Injectable } from '@angular/core';
import { BalancesDto } from './models/balances-dto';
import { AccountIdDto } from './models/account-id-dto';
import { AppConfig } from '../../app.config';
import { AccountResult } from './models/account-result';
import { AccountBalancesResult } from './models/account-balances-result';
import { MovementsResult } from './models/movements-result';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CredifondoResult } from './models/credifondo-result';

@Injectable({
  providedIn: 'root'
})
export class BalancesAndMovementsService {

  private _balancesAndMovements: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._balancesAndMovements = this.config.getConfig('BalancesAndMovementsServiceUrl');
  }

  getAccountBalancesById(request: AccountIdDto): Observable<AccountResult> {
    const { _balancesAndMovements } = this;
    return this.http.post<AccountResult>(`${_balancesAndMovements}GetBalancesById`, request);
  }

  getBalances(request: BalancesDto): Observable<AccountBalancesResult> {
    const { http, _balancesAndMovements } = this;
    return http.post<AccountBalancesResult>(`${_balancesAndMovements}GetBalances`, request);
  }

  getMovements(request: AccountIdDto): Observable<MovementsResult> {
    const { _balancesAndMovements } = this;
    return this.http.post<MovementsResult>(`${_balancesAndMovements}GetMovements`, request);
  }

  getReport(request: AccountIdDto): Observable<Blob> {
    const { _balancesAndMovements } = this;
    return this.http.post(`${_balancesAndMovements}GetReport`, request, { responseType: 'blob' });
  }

  //* Nuevo *//
  getBalancesCedifondo(): Observable<CredifondoResult[]> {
    const credifondoArray: CredifondoResult[] = [
      new CredifondoResult({
        id: "6069444",
        number: "10000019872",
        type: "Z",
        application: "CFO",
        applicationDescription: "CUENTA CREDIFONDO",
        currency: "BOL",
        currencyDescription: "BOLIVIANOS",
        formattedNumber: "488612401",
        owner: "CREDIFONDO + RENDIMIENTO FIA",
        inProgressOperations: null,
        withholding: 0,
        averageBalance: 0,
        availableBalance: 4348.44,
        accountingBalance: 4348.44,
        position: parseFloat((Math.random() * 10000).toFixed(2)),
        overdraftAmount: 0,
        overdraftBalance: 0,
        isAuthorizerControl: false,
        balanceErrorMessage: undefined,
        documentAccount: null,
        isSelected: false
      })
    ];
    return of(credifondoArray);
  }
}


export class AccountIdc {
  Idc!: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
