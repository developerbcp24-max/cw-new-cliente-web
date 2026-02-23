import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ProvidersCheckManagementData } from './models/providers-check-management-data';
import { ProvidersCheckManagementSpreadsheetsResult } from './models/providers-check-management-spreadsheets-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { MassivePaymentsSpreadsheetsDto } from '../mass-payments/Models/massive-payments-spreadsheets-dto';
import { MassPaymentFavoriteTransactions } from '../mass-payments/Models/mass-payment-favorite-transactions';
import { OperationStatusResult } from '../mass-payments/Models/operation-status-result';
import { MassivePaymentsPreviousFormResult } from '../mass-payments/Models/massive-payments-previous-form-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteTransactionDto } from '../mass-payments/Models/FavoriteTransactionDto';
import { MassivePaymentsPreviousFormDto } from '../mass-payments/Models/MassivePaymentsPreviousFormDto';

@Injectable()
export class ProvidersCheckManagementService {
  private _providersCheckManagementUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._providersCheckManagementUrl = this.config.getConfig('ProvidersCheckManagementUrl');
  }

  getPreviousSpreadsheets(req : MassivePaymentsPreviousFormDto): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._providersCheckManagementUrl}GetForm`, req);
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersCheckManagementSpreadsheetsResult[]> {
    return this.http.post<ProvidersCheckManagementSpreadsheetsResult[]>(`${this._providersCheckManagementUrl}GetPreviousForm`, request);
  }

  save(request: ProvidersCheckManagementData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._providersCheckManagementUrl}SaveCheckPayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<ProvidersCheckManagementSpreadsheetsResult[]> {
    return this.http.post<ProvidersCheckManagementSpreadsheetsResult[]>(`${this._providersCheckManagementUrl}LoadPayRoll`, request);//ojosos postFile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersCheckManagementData> {
    return this.http.post<ProvidersCheckManagementData>(`${this._providersCheckManagementUrl}GetDetail`, request);
  }

  getFavorites(req: FavoriteTransactionDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._providersCheckManagementUrl}Get`, req);
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<ProvidersCheckManagementData> {
    return this.http.post<ProvidersCheckManagementData>(`${this._providersCheckManagementUrl}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._providersCheckManagementUrl}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._providersCheckManagementUrl}Update`, request);
  }
}
