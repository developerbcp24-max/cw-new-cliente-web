import { Injectable } from '@angular/core';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { AppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import { ProvidersPaymentsSpreadsheetsResult } from './Models/providers-payments/providers-payments-spreadsheets-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ProvidersPaymentData } from './Models/providers-payments/providers-payment-data';
import { AccountProviderDto } from './Models/account-provider-dto';
import { AccountClientResult } from './Models/account-client-result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvidersPaymentsService {

  private _providersPayment: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._providersPayment = this.config.getConfig('ProvidersPaymentsServiceUrl');
  }

  getPreviousForm(): Observable<MassivePaymentsPreviousFormResult[]> {
    const {  _providersPayment } = this;
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${_providersPayment}GetPreviousForm`, '');
  }

  getForms(request: any): Observable<ProvidersPaymentsSpreadsheetsResult[]> {
    const {  _providersPayment } = this;
    return this.http.post<ProvidersPaymentsSpreadsheetsResult[]>(`${_providersPayment}GetForm`, request);
  }

  save(request: ProvidersPaymentData): Observable<ProcessBatchResult> {
    const { _providersPayment } = this;
    return this.http.post<ProcessBatchResult>(`${_providersPayment}SaveProvidersPayment`, request);
  }

  verificationAccount(request: AccountProviderDto[]): Observable<AccountClientResult[]> {
    const {  _providersPayment } = this;
    return this.http.post<AccountClientResult[]>(`${_providersPayment}VerifyAccount`, request);
  }

  chargeForm(request: any): Observable<ProvidersPaymentsSpreadsheetsResult[]> {
    const {  _providersPayment } = this;
    return this.http.post<ProvidersPaymentsSpreadsheetsResult[]>(`${_providersPayment}LoadPayRoll`, request);//ojosos postfile
  }

  getDetail(request: any): Observable<ProvidersPaymentData> {
    const {  _providersPayment } = this;
    return this.http.post<ProvidersPaymentData>(`${_providersPayment}GetDetail`, request);
  }
}
