import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { AccountClientResult } from './Models/account-client-result';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { OperationStatusResult } from './Models/operation-status-result';
import { SalariesPaymentData } from './Models/salaries-payments/salaries-payment-data';
import { SalariesPaymentsSpreadsheetsResult } from './Models/salaries-payments/salaries-payments-spreadsheets-result';
import { AccountClientDto } from './Models/account-client-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalariesPaymentsService {
  private salariesUrl: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this.salariesUrl = this.config.getConfig('SalariesPaymentServiceUrl');
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this.salariesUrl}GetPreviousForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<SalariesPaymentsSpreadsheetsResult[]> {
    return this.http.post<SalariesPaymentsSpreadsheetsResult[]>(`${this.salariesUrl}GetForm`, request);
  }

  save(request: SalariesPaymentData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this.salariesUrl}SaveSalariesPayment`, request);
  }

  verifyAccount(request: AccountClientDto): Observable<AccountClientResult> {
    return this.http.post<AccountClientResult>(`${this.salariesUrl}VerifyAccount`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<SalariesPaymentsSpreadsheetsResult[]> {
    return this.http.post<SalariesPaymentsSpreadsheetsResult[]>(`${this.salariesUrl}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<SalariesPaymentData> {
    return this.http.post<SalariesPaymentData>(`${this.salariesUrl}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this.salariesUrl}Get`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<SalariesPaymentData> {
    return this.http.post<SalariesPaymentData>(`${this.salariesUrl}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this.salariesUrl}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this.salariesUrl}Update`, request);
  }
}
