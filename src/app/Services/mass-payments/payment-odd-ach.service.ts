import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { PaymentOddAchSpreadsheetResult } from './Models/payment-odd-ach/payment-odd-ach-spreadsheet-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { PaymentOddAchData } from './Models/payment-odd-ach/payment-odd-ach-data';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { BatchIdDto } from '../service-payments/models/batch-id-dto';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { OperationStatusResult } from './Models/operation-status-result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentOddAchService {

  private _paymentOddAch: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._paymentOddAch = this.config.getConfig('PaymentOddAchUrl');
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._paymentOddAch}GetPreviousForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentOddAchSpreadsheetResult[]> {
    return this.http.post<PaymentOddAchSpreadsheetResult[]>(`${this._paymentOddAch}GetForm`, request);
  }

  save(request: PaymentOddAchData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._paymentOddAch}SavePaymenOddAch`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<PaymentOddAchSpreadsheetResult[]> {
    return this.http.post<PaymentOddAchSpreadsheetResult[]>(`${this._paymentOddAch}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: BatchIdDto): Observable<PaymentOddAchData> {
    return this.http.post<PaymentOddAchData>(`${this._paymentOddAch}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentOddAch}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentOddAchData> {
    return this.http.post<PaymentOddAchData>(`${this._paymentOddAch}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._paymentOddAch}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentOddAch}Update`, request);
  }
}
