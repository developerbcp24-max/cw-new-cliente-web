import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { GetBatchResult } from './models/get-batch-result';
import { FilterDto } from './models/filter-dto';
import { Observable } from 'rxjs';
import { OperationTypesResult } from './models/operation-types-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VouchersByBatchService {

  private _vouchersBatch: string;
  constructor(private http: HttpClient, private config: AppConfig){
    this._vouchersBatch = this.config.getConfig('VouchersByBatchUrl');
  }

  getVoucherList(month: FilterDto): Observable<GetBatchResult[]> {
    const { http, _vouchersBatch } = this;
    return http.post<GetBatchResult[]>(`${_vouchersBatch}GetVoucherList`, month);
  }

  getOperationTypeList(): Observable<OperationTypesResult[]> {
    const { http, _vouchersBatch } = this;
    return http.post<OperationTypesResult[]>(`${_vouchersBatch}GetOperationTypeList`, '');
  }

  getReportVouchers(request: GetBatchResult): Observable<Blob> {
    const { http, _vouchersBatch } = this;
    return http.post(`${_vouchersBatch}GetReport`, request, { responseType: 'blob' });//ojosos postReport
  }

}
