import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { RequestModelsAfpquery } from './Models/request-models-afpquery';
import { ResponseModelsAfpquery } from './Models/response-models-afpquery';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { AFPPayment } from '../AFP/Models/PaymentAFP';
import { PaymentAfpDetailDto } from './Models/payment-afp-detail-dto';
import { PaymentAfpDetailResult } from './Models/payment-afp-detail-result';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AfpService {
  private urlAFP: string;

  constructor(
    private config: AppConfig,
    private http: HttpClient
  ) {
    this.urlAFP = this.config.getConfig('AFPUrl');
  }

  getDetailAFP(request: RequestModelsAfpquery): Observable<ResponseModelsAfpquery> {
    const { http, urlAFP } = this;
    return http.post<ResponseModelsAfpquery>(`${urlAFP}GetDataAFPDetail`, request);
  }

  SavePaymentAFP(request: AFPPayment): Observable<ProcessBatchResult> {
    const { http, urlAFP } = this;
    return http.post<ProcessBatchResult>(`${urlAFP}SavePaymentAFP`, request);
  }

  getPaymetAfpDetail(paymentAfpDetailDto: PaymentAfpDetailDto): Observable<PaymentAfpDetailResult> {
    const { http, urlAFP } = this;
    return http.post<PaymentAfpDetailResult>(`${urlAFP}GetPaymentAFPDetail`, paymentAfpDetailDto);
  }
}
