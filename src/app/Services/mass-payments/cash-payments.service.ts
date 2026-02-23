import { Injectable } from '@angular/core';
import { JwtService } from '../../Jwt/jwt.service';
import { AppConfig } from '../../app.config';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { CashPaymentsSpreadsheetsResult } from './Models/cash-payments/cash-payments-spreadsheets-result';
import { CashPaymentData } from './Models/cash-payments/cash-payment-data';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { OperationStatusResult } from './Models/operation-status-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchIdDto } from '../service-payments/models/batch-id-dto';


@Injectable({
  providedIn: 'root'
})
export class CashPaymentsService {
  private _cashPayment: string;

  constructor(private http: HttpClient, private config: AppConfig, private jwt: JwtService) {
    this._cashPayment = this.config.getConfig('CashPaymentServiceUrl');
  }

  getDetail(request: any): Observable<CashPaymentData> {
    const {  _cashPayment } = this;
    return this.http.post<CashPaymentData>(`${_cashPayment}GetDetail`, request);
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._cashPayment}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<CashPaymentsSpreadsheetsResult[]> {
    return this.http.post<CashPaymentsSpreadsheetsResult[]>(`${this._cashPayment}GetPreviousForm`, request);
  }

  save(request: CashPaymentData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._cashPayment}SaveCashPayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<CashPaymentsSpreadsheetsResult[]> {
    return this.http.post<CashPaymentsSpreadsheetsResult[]>(`${this._cashPayment}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: BatchIdDto): Observable<CashPaymentData> {
    return this.http.post<CashPaymentData>(`${this._cashPayment}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._cashPayment}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<CashPaymentData> {
    return this.http.post<CashPaymentData>(`${this._cashPayment}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._cashPayment}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._cashPayment}Update`, request);
  }
}
