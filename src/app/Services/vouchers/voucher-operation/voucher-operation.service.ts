import { Injectable } from '@angular/core';
import { VoucherDto } from './models/voucher-dto';
import { VoucherResult } from './models/voucher-result';
import { AppConfig } from '../../../app.config';
import { TypeOperation } from './models/type-operation';
import { FilterDto } from './models/filter-dto';
import { UserCreationId } from './models/user-creation-id';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class VoucherOperationService {
  private _vouchers: string;
  private _voucherZip: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._vouchers = this.config.getConfig('VouchersUrl');
    this._voucherZip = this.config.getConfig('VouchersZipUrl');
  }

  GetListVoucher(month: FilterDto): Observable<VoucherResult[]> {
    const { http, _vouchers } = this;
    return http.post<VoucherResult[]>(`${_vouchers}GetListVoucher`, month);
  }

  GetListTypeOperation(): Observable<TypeOperation[]> {
    const { http, _vouchers } = this;
    return http.post<TypeOperation[]>(`${_vouchers}GetListTypeOperation`, '');
  }

  getReportVouchers(request: VoucherDto): Observable<Blob> {
    const { http, _vouchers } = this;
    return http.post(`${_vouchers}GetReportVoucher`, request, {
      responseType: 'blob',
    });
  }

  getFileVouchers(request: VoucherDto): Observable<Blob> {
    const { http, _vouchers } = this;
    return http.post(`${_vouchers}GetFileVoucher`, request, {
      responseType: 'blob',
    }); //ojosos postReport
  }

  downloadReportZip(request: VoucherDto): Observable<Blob> {
    const { http, _voucherZip } = this;
    return http.post(`${_voucherZip}DownloadReportZip`, request, {
      responseType: 'blob',
    }); //ojosos postReport
  }

  getUserId(request: VoucherDto): Observable<UserCreationId[]> {
    const { http, _vouchers } = this;
    return http.post<UserCreationId[]>(
      `${_vouchers}VerificationAuthorized`,
      request
    );
  }

  getNameFileTxt(request: VoucherDto): Observable<VoucherDto> {
    const { http, _vouchers } = this;
    return http.post<VoucherDto>(`${_vouchers}DownloadNameFileTxt`, request);
  }
}
