import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ServicesDto } from './models/services-dto';
import { Observable } from 'rxjs';
import { ServicesResult } from './models/services-result';
import { GetDebtsDto } from './models/get-debts-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ServicesPaseDto } from './models/services-pase-dto';
import { FavoriteServicesPaymentDto } from './models/favorite-services-payment-dto';
import { FavoriteServicesPaseResult } from './models/favorite-services-pase-result';
import { IdDto } from '../shared/models/id-dto';
import { ProcessBatchId } from '../shared/models/process-batch-id';
import { ServicesPasePaymentDetail } from './models/services-pase-payment-detail';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ServicePaseService {

  private servicePase: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this.servicePase = this.config.getConfig('ServicePaseUrl');
  }

  getServices(request: ServicesDto): Observable<ServicesResult[]> {
    const { http, servicePase } = this;
    return http.post<ServicesResult[]>(`${servicePase}GetServices`, request);
  }

  getDebts(request: GetDebtsDto): Observable<any> {
    const { http, servicePase } = this;
    return http.post(`${servicePase}GetDebts`, request);
  }

  savePayment(request: ServicesPaseDto): Observable<ProcessBatchResult> {
    const { http, servicePase } = this;
    return http.post<ProcessBatchResult>(`${servicePase}SavePayment`, request);
  }

  getFavorite(request: FavoriteServicesPaymentDto): Observable<FavoriteServicesPaseResult[]> {
    const { http, servicePase } = this;
    return http.post<FavoriteServicesPaseResult[]>(`${servicePase}Get`, request);
  }

  getFavoriteById(request: IdDto): Observable<any> {
    const { http, servicePase } = this;
    return http.post(`${servicePase}GetFavorite`, request);
  }

  deleteFavoriteById(request: IdDto): Observable<any> {
    const { http, servicePase } = this;
    return http.post(`${servicePase}RemoveFavorite`, request);
  }

  getDetail(request: ProcessBatchId): Observable<ServicesPasePaymentDetail> {
    const { http, servicePase } = this;
    return http.post<ServicesPasePaymentDetail>(`${servicePase}GetDetail`, request);
  }

  getBill(request: ProcessBatchId): Observable<Blob> {
    const { http, servicePase } = this;
    return http.post(`${servicePase}GetBill`, request, { responseType: 'blob' }); //ojosos postReport
  }


}
