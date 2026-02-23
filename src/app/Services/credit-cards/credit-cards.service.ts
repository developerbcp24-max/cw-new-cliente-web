import { AppConfig } from '../../app.config';
import { Injectable } from '@angular/core';
import { CreditCardsAccountByIdDto } from './models/credit-cards-by-id-dto';
import { AccountDto } from '../accounts/models/account-dto';
import { CreditCardsMovementsDto } from './models/credit-cards-movements-dto';
import { CreditCardsAccountResult } from './models/credit-cards-account-result';
import { CreditCardsMovementsResult } from './models/credit-cards-movements-result';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CreditCardsService {
  private _creditCardsUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._creditCardsUrl = this.config.getConfig('CreditCardsServiceUrl');
  }
  getAccountsCreditCards(dto: AccountDto): Observable<CreditCardsAccountResult[]> {
    const { http, _creditCardsUrl } = this;
    return http.post<CreditCardsAccountResult[]>(`${_creditCardsUrl}GetAccounts`, dto);
  }

  getAccountsCreditCardsById(dto: CreditCardsAccountByIdDto): Observable<CreditCardsAccountResult> {
    const { http, _creditCardsUrl } = this;
    return http.post<CreditCardsAccountResult>(`${_creditCardsUrl}GetAccountsById`, dto);
  }

  getMovementsCreditCards(dto: CreditCardsMovementsDto): Observable<CreditCardsMovementsResult[]> {
    const { http, _creditCardsUrl } = this;
    return http.post<CreditCardsMovementsResult[]>(`${_creditCardsUrl}GetMovements`, dto);
  }

  getReportMovements(dto: CreditCardsMovementsDto): Observable<Blob> {
    const { http, _creditCardsUrl } = this;
    return http.post(`${_creditCardsUrl}GetReport`, dto, { responseType: 'blob' });
  }
}
