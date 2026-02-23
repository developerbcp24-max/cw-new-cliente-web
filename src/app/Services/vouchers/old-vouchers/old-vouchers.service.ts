import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { JwtService } from '../../../Jwt/jwt.service';
import { FilterDto } from '../voucher-operation/models/filter-dto';
import { VoucherResult } from '../voucher-operation/models/voucher-result';
import { TypeOperation } from '../voucher-operation/models/type-operation';
import { Observable } from 'rxjs';
import { VoucherDto } from '../voucher-operation/models/voucher-dto';
import { UserCreationId } from '../voucher-operation/models/user-creation-id';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OldVouchersService {

  private _vouchers: string;

  constructor(private http: HttpClient, private config: AppConfig, private jwt: JwtService) {
    this._vouchers = this.config.getConfig('OldVouchersUrl');
  }

  getListOldVoucher(month: FilterDto): Observable<VoucherResult[]> {
    const { http, _vouchers } = this;
    return http.post<VoucherResult[]>(`${_vouchers}GetListOldVoucher`, month);
  }

  getOldTypeOperation(month: FilterDto): Observable<TypeOperation[]> {
    const { http, _vouchers } = this;
    return http.post<TypeOperation[]>(`${_vouchers}GetOldTypeOperation`, month);
  }

  getOldReport(request: VoucherDto): Observable<Blob> {
    const { http, _vouchers } = this;
    return http.post(`${_vouchers}GetReports`, request, { responseType: 'blob' });//ojosos postReport
  }

  getOldFileVouchers(request: VoucherDto): Observable<Blob> {
    const { http, _vouchers } = this;
    return http.post(`${_vouchers}GetFileTxt`, request, { responseType: 'blob' });//ojosos postReport
  }
  downloadOldReportZip(request: VoucherDto): Observable<Blob> {
    const { http, _vouchers } = this;
    return http.post(`${_vouchers}DownloadReportZip`, request, { responseType: 'blob' });//ojosos postReport
  }
  getOldUserId(request: VoucherDto): Observable<UserCreationId[]> {
    const { http, _vouchers } = this;
    return http.post<UserCreationId[]>(`${_vouchers}GetVerifyAuthorizationSalaries`, request);
  }
  getOldNameFileTxt(request: VoucherDto): Observable<VoucherDto> {
    const { http, _vouchers } = this;
    return http.post<VoucherDto>(`${_vouchers}DownloadNameFileTxt`, request);
  }

}
