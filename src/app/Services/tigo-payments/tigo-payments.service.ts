import { Injectable } from '@angular/core';

import { AppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import { GetDebtsResponse } from './models/get-debts-response';
import { GetTigoDebtsDto } from './models/get-tigo-debts-dto';
import { ProcessBatchId } from '../shared/models/process-batch-id';
import { TigoDetailResult } from './models/tigo-detail-result';
import { FavoriteTigoResult } from './models/favorite-tigo-result';
import { IdDto } from '../shared/models/id-dto';
import { TigoDto } from './models/tigo-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { FavoriteTigoByIdResult } from './models/favorite-tigo-by-id-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TigoPaymentsService {

  private tigoPaymentsUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.tigoPaymentsUrl = this.config.getConfig('tigoPaymentUrl');
  }

  getDebtsTigo(request: GetTigoDebtsDto): Observable<GetDebtsResponse> {
    const { http, tigoPaymentsUrl } = this;
    return http.post<GetDebtsResponse>(`${tigoPaymentsUrl}GetDebts`, request);
  }

  getDetail(request: ProcessBatchId): Observable<TigoDetailResult> {
    const { http, tigoPaymentsUrl } = this;
    return http.post<TigoDetailResult>(`${tigoPaymentsUrl}GetDetail`, request);
  }

  getFavorites(): Observable<FavoriteTigoResult[]> {
    const { http, tigoPaymentsUrl } = this;
    return http.post<FavoriteTigoResult[]>(`${tigoPaymentsUrl}GetFavorites`, null);
  }

  getFavorite(request: IdDto): Observable<FavoriteTigoByIdResult> {
    const { http, tigoPaymentsUrl } = this;
    return http.post<FavoriteTigoByIdResult>(`${tigoPaymentsUrl}GetFavorite`, request);
  }

  removeFavorite(request: IdDto): Observable<string> {
    const { http, tigoPaymentsUrl } = this;
    return http.post<string>(`${tigoPaymentsUrl}RemoveFavorite`, request);
  }

  savePayment(request: TigoDto): Observable<ProcessBatchResult> {
    const { http, tigoPaymentsUrl } = this;
    return http.post<ProcessBatchResult>(`${tigoPaymentsUrl}SavePayment`, request);
  }

}
