import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { VoucherDto } from './models/voucher-dto';
import { VoucherResult } from './models/voucher-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VouchersByOperationService {
  private vouchersByOperation: string;
  constructor(private http: HttpClient, private config: AppConfig){
    this.vouchersByOperation = this.config.getConfig('VouchersByOperationUrl');
  }

  getVouchers(request: VoucherDto): Observable<VoucherResult[]> {
    const { http, vouchersByOperation } = this;
    return http.post<VoucherResult[]>(`${vouchersByOperation}GetVouchers`, request);
  }

  getReport(request: VoucherResult): Observable<Blob> {
    const { http, vouchersByOperation } = this;
    return http.post(`${vouchersByOperation}GetReport`, request, { responseType: 'blob' });
  }

  downloadReportZip(request: VoucherResult[]): Observable<Blob> {
    const { http, vouchersByOperation } = this;
    return http.post(`${vouchersByOperation}DownloadReportZip`, request, { responseType: 'blob' });
  }

  downloadReportMassive(request: VoucherResult[]): Observable<Blob> {
    const { http, vouchersByOperation } = this;
    return http.post(`${vouchersByOperation}GetReportMassive`, request, { responseType: 'blob' });
  }
}
