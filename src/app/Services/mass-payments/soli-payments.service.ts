import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { BatchIdDto } from '../shared/models/batch-id-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { OperationStatusResult } from './Models/operation-status-result';
import { SoliPaymentData } from './Models/soli-payments/soli-payment-data';
import { SoliPaymentsSpreadsheetsResult } from './Models/soli-payments/soli-payments-spreadsheets-result';

@Injectable({
  providedIn: 'root'
})
export class SoliPaymentsService {
  private _soliPayment: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._soliPayment = this.config.getConfig('SoliPaymentServiceUrl');
  }

  getDetail(request: any): Observable<SoliPaymentData> {
    const {  _soliPayment } = this;
    return this.http.post<SoliPaymentData>(`${_soliPayment}GetDetail`, request);
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._soliPayment}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<SoliPaymentsSpreadsheetsResult[]> {
    return this.http.post<SoliPaymentsSpreadsheetsResult[]>(`${this._soliPayment}GetPreviousForm`, request);
  }

  save(request: SoliPaymentData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._soliPayment}SaveSoliPayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<SoliPaymentsSpreadsheetsResult[]> {
    return this.http.post<SoliPaymentsSpreadsheetsResult[]>(`${this._soliPayment}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: BatchIdDto): Observable<SoliPaymentData> {
    return this.http.post<SoliPaymentData>(`${this._soliPayment}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._soliPayment}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<SoliPaymentData> {
    return this.http.post<SoliPaymentData>(`${this._soliPayment}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._soliPayment}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._soliPayment}Update`, request);
  }

  validateTransaction(request: SoliPaymentsSpreadsheetsResult): Observable<SoliPaymentsSpreadsheetsResult> {
    return this.http.post<SoliPaymentsSpreadsheetsResult>(`${this._soliPayment}ValidateTransaction`, request);
  }

}
