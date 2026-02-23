import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { FavoritePaymentsSpreadsheetsResult } from './Models/favorite-payments/favorite-payments-spreadsheets-result';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { Observable } from 'rxjs';
import { FavoritePaymentsData } from './Models/favorite-payments/favorite-payments-data';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoritePaymentsConfigService {

  private _favoritePayment: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._favoritePayment = this.config.getConfig('FavoritePaymentConfigServiceUrl');
  }

  getManualSpreadsheets(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._favoritePayment}GetManualForm`, request);
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._favoritePayment}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._favoritePayment}GetPreviousForm`, request);
  }

  save(request: FavoritePaymentsData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._favoritePayment}SaveFavoritePayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._favoritePayment}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsData> {
    return this.http.post<FavoritePaymentsData>(`${this._favoritePayment}GetDetail`, request);
  }

  getverifyBatches(): Observable<boolean> {
    return this.http.post<boolean>(`${this._favoritePayment}VerifyBatches`, '');
  }
}
