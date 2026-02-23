import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ConsultQuotaDto } from './models/consult-quota-dto';
import { ConsultQuotaResult } from './models/consult-quota-result';
import { QuotaPaymentDto } from './models/quota-payment-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { VouchersCreditsDto } from './models/vouchers-credits-dto';
import { GetPaymentListCreditResult } from './models/get-payment-list-credit-result';
import { QuotaPaymentDetailDto } from './models/quota-payment-detail-dto';
import { QuotaPaymentDetailResult } from './models/quota-payment-detail-result';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CreditsService {

  private creditsUrl: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this.creditsUrl = this.config.getConfig('CreditsServiceUrl');
  }

  getQuotaPayment(request: ConsultQuotaDto): Observable<ConsultQuotaResult> {
    const { http, creditsUrl } = this;
    return http.post<ConsultQuotaResult>(`${creditsUrl}GetQuotaPayment`, request);
  }

  saveQuotaPayment(request: QuotaPaymentDto): Observable<ProcessBatchResult> {
    const { http, creditsUrl } = this;
    return http.post<ProcessBatchResult>(`${creditsUrl}SaveQuotaPayment`, request);
  }

  GetPaymentsListCredit(request: VouchersCreditsDto): Observable<GetPaymentListCreditResult[]> {
    const { http, creditsUrl } = this;
    return http.post<GetPaymentListCreditResult[]>(`${creditsUrl}GetPaymentsListCredit`, request);
  }

  GetPaymentsListCreditReport(request: VouchersCreditsDto): Observable<Blob> {
    const { http, creditsUrl } = this;
    return http.post(`${creditsUrl}GetPaymentsListCreditReport`, request, { responseType: 'blob' });
  }

  GetDetailPaymentCredit(request: VouchersCreditsDto): Observable<any> {
    const { http, creditsUrl } = this;
    return http.post(`${creditsUrl}GetDetailPaymentCredit`, request);
  }

  GetDetailPaymentCreditReport(request: VouchersCreditsDto): Observable<Blob> {
    const { http, creditsUrl } = this;
    return http.post(`${creditsUrl}GetDetailPaymentCreditReport`, request, { responseType: 'blob' });
  }

  GetDisbursements(request: VouchersCreditsDto): Observable<GetPaymentListCreditResult[]> {
    const { http, creditsUrl } = this;
    return http.post<GetPaymentListCreditResult[]>(`${creditsUrl}GetDisbursements`, request);
  }

  GetDisbursementsListReport(request: VouchersCreditsDto): Observable<Blob> {
    const { http, creditsUrl } = this;
    return http.post(`${creditsUrl}GetDisbursementsListReport`, request, { responseType: 'blob'});
  }

  GetDisbursementsHeaderReport(request: VouchersCreditsDto): Observable<Blob> {
    const { http, creditsUrl } = this;
    return http.post(`${creditsUrl}GetDisbursementsHeaderReport`, request, { responseType: 'blob' });
  }

  GetPaymentPlan(request: VouchersCreditsDto): Observable<Blob> {
    const { http, creditsUrl } = this;
    return http.post(`${creditsUrl}GetPaymentPlan`, request, { responseType: 'blob' });
  }

  GetQuotaPaymentDetail(request: QuotaPaymentDetailDto): Observable<QuotaPaymentDetailResult> {
    const { http, creditsUrl } = this;
    return http.post<QuotaPaymentDetailResult>(`${creditsUrl}GetQuotaPaymentDetail`, request);
  }
}
