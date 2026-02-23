import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { BatchIdDto } from '../service-payments/models/batch-id-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { AccountClientResult } from './Models/account-client-result';
import { AccountProviderDto } from './Models/account-provider-dto';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { ProvidersPaymentData } from './Models/providers-payments/providers-payment-data';
import { ProvidersPaymentsSpreadsheetsResult } from './Models/providers-payments/providers-payments-spreadsheets-result';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { OperationStatusResult } from './Models/operation-status-result';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvidersAccountDepositService {

  private providersAccountDepositUrl: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this.providersAccountDepositUrl = this.config.getConfig('ProvidersPaymentsServiceUrl');
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this.providersAccountDepositUrl}GetPreviousForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersPaymentsSpreadsheetsResult[]> {
    return this.http.post<ProvidersPaymentsSpreadsheetsResult[]>(`${this.providersAccountDepositUrl}GetForm`, request);
  }

  save(request: ProvidersPaymentData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this.providersAccountDepositUrl}SaveProvidersPayment`, request);
  }

  verifyAccount(request: AccountProviderDto): Observable<AccountClientResult> {
    return this.http.post<AccountClientResult>(`${this.providersAccountDepositUrl}VerifyAccount`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<ProvidersPaymentsSpreadsheetsResult[]> {
    return this.http.post<ProvidersPaymentsSpreadsheetsResult[]>(`${this.providersAccountDepositUrl}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: BatchIdDto): Observable<ProvidersPaymentData> {
    return this.http.post<ProvidersPaymentData>(`${this.providersAccountDepositUrl}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this.providersAccountDepositUrl}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersPaymentData> {
    return this.http.post<ProvidersPaymentData>(`${this.providersAccountDepositUrl}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this.providersAccountDepositUrl}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this.providersAccountDepositUrl}Update`, request);
  }
}
