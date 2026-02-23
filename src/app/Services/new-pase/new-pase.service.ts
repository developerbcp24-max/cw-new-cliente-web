import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ServicesDto } from '../service-pase/models/services-dto';
import { GetServicesResult } from './models/get-services-result';
import { Observable } from 'rxjs';
import { GetDebtsResult } from './models/get-debts-result';
import { GetDebtsDto } from '../service-pase/models/get-debts-dto';
import { NewPaseDto } from './models/new-pase-dto ';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { IdDto } from '../shared/models/id-dto';
import { FavoritePaymentDto } from './models/favorite-payment-dto';
import { FavoriteServicesPaymentDto } from '../service-pase/models/favorite-services-payment-dto';
import { FavoriteNewPaseResult } from './models/favorite-new-pase-result';
import { ProcessBatchId } from '../shared/models/process-batch-id';
import { NewPasePaymentDetailResult } from './models/new-pase-payment-detail-result';
import { ProcessBatchIdLine } from '../shared/models/process-batch-id-line';
import { CategoryServiceDto, CategoryServicePaseResult } from './models/category-service-pase-result';
import { NewPaseTypeResult } from './models/new-pase-type-result';
import { ConfigNewServicePaseResult } from './models/config-new-service-pase-result';
import { GetRubrosResult } from './models/get-rubros-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NewPaseService {

  private servicePase: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this.servicePase = this.config.getConfig('NewPaseUrl');
  }


  getServices(request: ServicesDto): Observable<GetServicesResult[]> {
    const { http, servicePase } = this;
    return http.post<GetServicesResult[]>(`${servicePase}GetServices`, request);
  }

  getDebtsNewPase(request: GetDebtsDto): Observable<GetDebtsResult[]> {
    const { http, servicePase } = this;
    return http.post<GetDebtsResult[]>(`${servicePase}GetDebts`, request);
  }

  savePayment(request: NewPaseDto): Observable<ProcessBatchResult> {
    const { http, servicePase } = this;
    return http.post<ProcessBatchResult>(`${servicePase}SavePayment`, request);
  }

  getFavorite(request: FavoriteServicesPaymentDto): Observable<FavoriteNewPaseResult[]> {
    const { http, servicePase } = this;
    return http.post<FavoriteNewPaseResult[]>(`${servicePase}Get`, request);
  }

  getFavoriteById(request: IdDto): Observable<FavoritePaymentDto[]> {
    const { http, servicePase } = this;
    return http.post<FavoritePaymentDto[]>(`${servicePase}GetFavorite`, request);
  }

  deleteFavoriteById(request: IdDto): Observable<any> {
    const { http, servicePase } = this;
    return http.post(`${servicePase}RemoveFavorite`, request);
  }

  getDetail(request: ProcessBatchId): Observable<NewPasePaymentDetailResult> {
    const { http, servicePase } = this;
    return http.post<NewPasePaymentDetailResult>(`${servicePase}GetDetail`, request);
  }

  getCategoryService(): Observable<CategoryServicePaseResult[]> {
    const { http, servicePase } = this;
    return http.post<CategoryServicePaseResult[]>(`${servicePase}GetCategoryService`, null);
  }

  getPaseRubros(): Observable<GetRubrosResult[]> {
    const { http, servicePase } = this;
    return http.post<GetRubrosResult[]>(`${servicePase}GetRubros`, null);
  }

  getPaseRubrosDetail(request: ServicesDto): Observable<GetRubrosResult[]> {
    const { http, servicePase } = this;
    return http.post<GetRubrosResult[]>(`${servicePase}GetRubrosDetail`, request);
  }

  getPaseService(request: CategoryServiceDto): Observable<NewPaseTypeResult[]> {
    const { http, servicePase } = this;
    return http.post<NewPaseTypeResult[]>(`${servicePase}GetPaseService`, request);
  }

  getConfiguration(request: FavoriteServicesPaymentDto): Observable<ConfigNewServicePaseResult[]> {
    const { http, servicePase } = this;
    return http.post<ConfigNewServicePaseResult[]>(`${servicePase}GetConfiguration`, request);
  }

  getBill(request: ProcessBatchIdLine): Observable<Blob> {
    const { http, servicePase } = this;
    return http.post(`${servicePase}GetBill`, request, { responseType: 'blob' });//ojosos postReport
  }


}
