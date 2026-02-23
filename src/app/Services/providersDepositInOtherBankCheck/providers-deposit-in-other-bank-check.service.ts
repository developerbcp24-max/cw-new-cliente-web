import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ProvidersDepositInOtherBankCheckData } from './models/providers-deposit-in-other-bank-check-data';
import { ProvidersDepositInOtherBankCheckSpreadsheetsResult } from './models/providers-deposit-in-other-bank-check-spreadsheets-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { MassPaymentFavoriteTransactions } from '../mass-payments/Models/mass-payment-favorite-transactions';
import { MassivePaymentsSpreadsheetsDto } from '../mass-payments/Models/massive-payments-spreadsheets-dto';
import { OperationStatusResult } from '../mass-payments/Models/operation-status-result';
import { MassivePaymentsPreviousFormResult } from '../mass-payments/Models/massive-payments-previous-form-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ProvidersDepositInOtherBankCheckService {
  private _depositInOtherBankCheckUrl: string;
  constructor(private http: HttpClient, private config: AppConfig){
    this._depositInOtherBankCheckUrl = this.config.getConfig('ProvidersDepositInOtherBankCheckUrl');
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._depositInOtherBankCheckUrl}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersDepositInOtherBankCheckSpreadsheetsResult[]> {
    return this.http.post<ProvidersDepositInOtherBankCheckSpreadsheetsResult[]>(`${this._depositInOtherBankCheckUrl}GetPreviousForm`, request);
  }

  save(request: ProvidersDepositInOtherBankCheckData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._depositInOtherBankCheckUrl}SaveDepositPayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<ProvidersDepositInOtherBankCheckSpreadsheetsResult[]> {
    return this.http.post<ProvidersDepositInOtherBankCheckSpreadsheetsResult[]>(`${this._depositInOtherBankCheckUrl}LoadPayRoll`, request);//ojosos postFile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersDepositInOtherBankCheckData> {
    return this.http.post<ProvidersDepositInOtherBankCheckData>(`${this._depositInOtherBankCheckUrl}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._depositInOtherBankCheckUrl}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersDepositInOtherBankCheckData> {
    return this.http.post<ProvidersDepositInOtherBankCheckData>(`${this._depositInOtherBankCheckUrl}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._depositInOtherBankCheckUrl}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._depositInOtherBankCheckUrl}Update`, request);
  }
}
