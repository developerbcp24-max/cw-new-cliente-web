import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { MultiplePaymentsData } from './Models/multiple-payments/multiple-payments-data';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { MultiplePaymentSpreadsheetsResult } from './Models/multiple-payments/multiple-payment-spreadsheets-result';
import { MultiplePaymentUpdateDto } from './Models/multiple-payments/multiple-payment-update-dto';
import { MultiplePaymentsUpdateResult } from './Models/multiple-payments/multiple-payment-update-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultiplePaymentsService {
  private _multiplePayment: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._multiplePayment = this.config.getConfig('MultiplePaymentServiceUrl');
  }

  updateMultiplePayments(dto: MultiplePaymentUpdateDto): Observable<MultiplePaymentsUpdateResult> {
    const { http, _multiplePayment } = this;
    return http.post<MultiplePaymentsUpdateResult>(`${_multiplePayment}UpdateMultiplePayments`, dto);//ojosos postfile
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._multiplePayment}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<MultiplePaymentSpreadsheetsResult[]> {
    return this.http.post<MultiplePaymentSpreadsheetsResult[]>(`${this._multiplePayment}GetPreviousForm`, request);
  }

  save(request: MultiplePaymentsData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._multiplePayment}SaveMultiplePayment`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<MultiplePaymentSpreadsheetsResult[]> {
    return this.http.post<MultiplePaymentSpreadsheetsResult[]>(`${this._multiplePayment}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<MultiplePaymentsData> {
    return this.http.post<MultiplePaymentsData>(`${this._multiplePayment}GetDetail`, request);
  }

}
