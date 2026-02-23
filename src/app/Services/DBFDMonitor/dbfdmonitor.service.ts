import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { AppConfig } from 'src/app/app.config';
import { AppConfig } from '../../app.config';
import { PaymentAchData } from '../mass-payments/Models/payment-ach/payment-ach-data';
import { Observable } from 'rxjs';
import { PaymentAchSpreadsheetResult } from '../mass-payments/Models/payment-ach/payment-ach-spreadsheet-result';
import { MultiplePaymentsData } from '../mass-payments/Models/multiple-payments/multiple-payments-data';
import { MultiplePaymentSpreadsheetsResult } from '../mass-payments/Models/multiple-payments/multiple-payment-spreadsheets-result';
import { FavoritePaymentsData } from '../mass-payments/Models/favorite-payments/favorite-payments-data';
import { FavoritePaymentsSpreadsheetsResult } from '../mass-payments/Models/favorite-payments/favorite-payments-spreadsheets-result';

@Injectable({
  providedIn: 'root'
})
export class DBFDMonitorService {

  private _DBFDMonitor: string;
  ipClient?: string;
  constructor(private http: HttpClient, private config: AppConfig) {
    this._DBFDMonitor = this.config.getConfig('DBFDMonitor');
  }
  superviceMonitor(request: PaymentAchData): Observable<PaymentAchSpreadsheetResult[]> {
    return this.http.post<PaymentAchSpreadsheetResult[]>(`${this._DBFDMonitor}DBFDMonitorRespAch`, request);
  }

  superviceMonitorMultiple(request: MultiplePaymentsData): Observable<MultiplePaymentSpreadsheetsResult[]> {
    return this.http.post<MultiplePaymentSpreadsheetsResult[]>(`${this._DBFDMonitor}DBFDMonitorRespMultipleAch`, request);
  }

  superviceMonitorFavorite(request: FavoritePaymentsData): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._DBFDMonitor}DBFDMonitorRespFavoriteAch`, request);
  }

  superviceMonitorNational(request: PaymentAchData): Observable<PaymentAchSpreadsheetResult[]> {
    return this.http.post<PaymentAchSpreadsheetResult[]>(`${this._DBFDMonitor}DBFDMonitorRespAch`, request);
  }
}
