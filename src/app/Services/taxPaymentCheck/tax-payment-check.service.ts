import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { PaymentTaxCheckSpreadsheetsResult } from './models/payment-tax-check-spreadsheets-result';
import { PaymentTaxCheckData } from './models/payment-tax-check-data';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { MassPaymentFavoriteTransactions } from '../mass-payments/Models/mass-payment-favorite-transactions';
import { MassivePaymentsSpreadsheetsDto } from '../mass-payments/Models/massive-payments-spreadsheets-dto';
import { OperationStatusResult } from '../mass-payments/Models/operation-status-result';
import { MassivePaymentsPreviousFormResult } from '../mass-payments/Models/massive-payments-previous-form-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TaxPaymentCheckService {
  private _paymentTaxCheckUrl: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._paymentTaxCheckUrl = this.config.getConfig('PaymentTaxCheckUrl');
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._paymentTaxCheckUrl}GetPreviousForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentTaxCheckSpreadsheetsResult[]> {
    return this.http.post<PaymentTaxCheckSpreadsheetsResult[]>(`${this._paymentTaxCheckUrl}GetForm`, request);
  }

  save(request: PaymentTaxCheckData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._paymentTaxCheckUrl}SaveTaxCheckPayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<PaymentTaxCheckSpreadsheetsResult[]> {
    return this.http.post<PaymentTaxCheckSpreadsheetsResult[]>(`${this._paymentTaxCheckUrl}LoadPayRoll`, request);//ojosos postFile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentTaxCheckData> {
    return this.http.post<PaymentTaxCheckData>(`${this._paymentTaxCheckUrl}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentTaxCheckUrl}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentTaxCheckData> {
    return this.http.post<PaymentTaxCheckData>(`${this._paymentTaxCheckUrl}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._paymentTaxCheckUrl}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentTaxCheckUrl}Update`, request);
  }
}
