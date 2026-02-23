import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import { GetClientResponse } from './models/get-client-response';
import { GetDebtsClientEntelDto } from './models/get-debts-client-entel-dto';
import { ClientDebtsEntelResult } from './models/client-debts-entel-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { EntelDto } from './models/entel-dto';
import { FavoriteEntelResult } from './models/favorite-entel-result';
import { FavoriteServicesByIdResult } from './models/favorite-services-by-id-result';
import { IdDto } from '../shared/models/id-dto';
import { EntelDetailResult } from './models/entel-detail-result';
import { ProcessBatchId } from '../shared/models/process-batch-id';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TelephoneServicesService {

  private telephoneUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.telephoneUrl = this.config.getConfig('telephoneServiceUrl');
  }

  getClientEntel(request: GetDebtsClientEntelDto): Observable<GetClientResponse[]> {
    const { http, telephoneUrl } = this;
    return http.post<GetClientResponse[]>(`${telephoneUrl}GetClientEntel`, request);
  }

  getDebtsEntel(request: GetDebtsClientEntelDto): Observable<ClientDebtsEntelResult[]> {
    const { http, telephoneUrl } = this;
    return http.post<ClientDebtsEntelResult[]>(`${telephoneUrl}GetDebtsEntel`, request);
  }

  getDetail(request: ProcessBatchId): Observable<EntelDetailResult> {
    const { http, telephoneUrl } = this;
    return http.post<EntelDetailResult>(`${telephoneUrl}GetDetail`, request);
  }

  getFavorites(): Observable<FavoriteEntelResult[]> {
    const { http, telephoneUrl } = this;
    return http.post<FavoriteEntelResult[]>(`${telephoneUrl}GetFavorites`, null);
  }

  getFavorite(request: IdDto): Observable<FavoriteServicesByIdResult[]> {
    const { http, telephoneUrl } = this;
    return http.post<FavoriteServicesByIdResult[]>(`${telephoneUrl}GetFavorite`, request);
  }

  removeFavorite(request: FavoriteServicesByIdResult): Observable<string> {
    const { http, telephoneUrl } = this;
    return http.post<string>(`${telephoneUrl}RemoveFavorite`, request);
  }

  savePayment(request: EntelDto): Observable<ProcessBatchResult> {
    const { http, telephoneUrl } = this;
    return http.post<ProcessBatchResult>(`${telephoneUrl}SavePayment`, request);
  }

}
