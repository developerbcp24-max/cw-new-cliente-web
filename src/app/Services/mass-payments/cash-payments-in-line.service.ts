import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { BatchIdDto } from '../shared/models/batch-id-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { CashPaymentInLineData } from './Models/cash-payments-in-line/cash-payment-in-line-data';
import { CashPaymentsInLineSpreadsheetsResult } from './Models/cash-payments-in-line/cash-payments-in-line-spreadsheets-result';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { OperationStatusResult } from './Models/operation-status-result';

@Injectable({
  providedIn: 'root'
})
export class CashPaymentsInLineService {
  private _cashPaymentOnline: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._cashPaymentOnline = this.config.getConfig('CashPaymentOnlineServiceUrl');
  }

  getDetail(request: any): Observable<CashPaymentInLineData> {
    const {  _cashPaymentOnline } = this;
    return this.http.post<CashPaymentInLineData>(`${_cashPaymentOnline}GetDetail`, request);
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._cashPaymentOnline}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<CashPaymentsInLineSpreadsheetsResult[]> {
    return this.http.post<CashPaymentsInLineSpreadsheetsResult[]>(`${this._cashPaymentOnline}GetPreviousForm`, request);
  }

  save(request: CashPaymentInLineData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._cashPaymentOnline}SaveCashPayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<CashPaymentsInLineSpreadsheetsResult[]> {
    return this.http.post<CashPaymentsInLineSpreadsheetsResult[]>(`${this._cashPaymentOnline}LoadPayRoll`, request);
  }

  getPaymentDetail(request: BatchIdDto): Observable<CashPaymentInLineData> {
    return this.http.post<CashPaymentInLineData>(`${this._cashPaymentOnline}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._cashPaymentOnline}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<CashPaymentInLineData> {
    return this.http.post<CashPaymentInLineData>(`${this._cashPaymentOnline}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._cashPaymentOnline}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._cashPaymentOnline}Update`, request);
  }

}
