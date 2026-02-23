import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ElfecRequest } from './models/elfec-request';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ElfecDto } from './models/elfec-dto';
import { FavoriteElfecIdDto } from './models/favorite-elfec-id-dto';
import { FavoriteElfecResult } from './models/favorite-elfec-result';
import { PaymentElfecDetailResult } from './models/payment-elfec-detail-result';
import { PaymentElfecDetailDto } from './models/payment-elfec-detail-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ElfecService {

  private elfecUrl: string;

  constructor(private config: AppConfig, private http: HttpClient) {
    this.elfecUrl = this.config.getConfig('ElfecUrl');
  }

  getDebts(request: ElfecRequest): Observable<any> {
    const { http, elfecUrl } = this;
    return http.post<any>(`${elfecUrl}GetDebtsElfec`, request);
  }

  getFavorite(): Observable<FavoriteElfecResult[]> {
    const { http, elfecUrl } = this;
    return http.post<FavoriteElfecResult[]>(`${elfecUrl}Get`, '');
  }

  getFavoriteById(request: FavoriteElfecIdDto): Observable<any> {
    const { http, elfecUrl } = this;
    return http.post(`${elfecUrl}GetFavorite`, request);
  }

  deleteFavoriteById(request: FavoriteElfecIdDto): Observable<any> {
    const { http, elfecUrl } = this;
    return http.post(`${elfecUrl}RemoveFavorite`, request);
  }

  savePayment(request: ElfecDto): Observable<ProcessBatchResult> {
    const { http, elfecUrl } = this;
    return http.post<ProcessBatchResult>(`${elfecUrl}SavePayment`, request);
  }

  getPaymetElfecDetail(request: PaymentElfecDetailDto): Observable<PaymentElfecDetailResult> {
    const { http, elfecUrl } = this;
    return http.post<PaymentElfecDetailResult>(`${elfecUrl}GetElfecDetail`, request);
  }

  getBill(request: PaymentElfecDetailDto): Observable<Blob> {
    const { http, elfecUrl } = this;
    return http.post(`${elfecUrl}GetBill`, request, { responseType: 'blob' });
  }
}
