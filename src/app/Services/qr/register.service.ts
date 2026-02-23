import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { QrPaymentData } from './models/qr-payment-data';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { QrPaymaentsResult } from './models/qr-payments-result';
import { Observable } from 'rxjs';
import { ReportQRRequest } from './models/ReportQRRequest';
import { ReportQRCopabolRequest } from './models/ReportQRCopabolRequest';
import { ReportQRRespons, TransaccionDetail } from './models/ReportQRResponse';
import { ListBusinesQR, ListQRPaymentDetailData } from './models/ListBusinessQR';
import { ListBranchQR } from './models/ListBranchQR';
import { ListAtmQR } from './models/ListAtmQR';
import { ResultParameters } from './models/ResultParametes';
import { BusinesBranchId } from './models/BusinesBranchId';
import { GetBranchListRequest } from './models/GetBranchListRequest';
import { GetBranchListResponse } from './models/GetBranchListResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private qrUrl: string;
  constructor(private http: HttpClient, private config: AppConfig) {
    this.qrUrl = this.config.getConfig('QrPaymentServiceUrl');
  }

  process(request: QrPaymentData): Observable<ProcessBatchResult>  {
    return this.http.post<ProcessBatchResult>(`${this.qrUrl}Process`, request);
  }
  getQr(dto: QrPaymentData): Observable<Blob> {
    const { qrUrl } = this;
    return this.http.post(`${qrUrl}GetQR`, dto, { responseType: 'blob' });
  }

  downloadReportZip(request: QrPaymaentsResult[]): Observable<Blob> {
    const { qrUrl } = this;
    return this.http.post(`${qrUrl}GetQR`, request, { responseType: 'blob' });
  }

  //Nuevo report QR del BcckOffice QR
  getReportQr(request: ReportQRRequest): Observable<ReportQRRespons>{
    return this.http.post<ReportQRRespons>(`${this.qrUrl}GetReportQr`, request);
  }
  // Nuevo reporte Copabol, cinemark
  GetBranchList(request: GetBranchListRequest): Observable<GetBranchListResponse>{
    return this.http.post<GetBranchListResponse>(`${this.qrUrl}GetBranchList`, request);
  }
  getReportQrCopabol(request: ReportQRCopabolRequest): Observable<ReportQRRespons>{
    return this.http.post<ReportQRRespons>(`${this.qrUrl}GetReportQrCopabol`, request);
  }

  getQRPaymentDetails(): Observable<ListQRPaymentDetailData[]> {
    const { http, qrUrl } = this;
    return http.post<ListQRPaymentDetailData[]>(`${qrUrl}GetQRPaymentDetails`, '');
  }

  getBusinessQR(): Observable<ListBusinesQR[]> {
    const { http, qrUrl } = this;
    return http.post<ListBusinesQR[]>(`${qrUrl}GetBusinessQR`, '');
  }

  getBranchesQR(request: BusinesBranchId): Observable<ListBranchQR[]> {
    const { http, qrUrl } = this;
    return http.post<ListBranchQR[]>(`${qrUrl}GetBranchQR`, request);
  }
  getAtmQR(request: BusinesBranchId): Observable<ListAtmQR[]> {
    const { http, qrUrl } = this;
    return http.post<ListAtmQR[]>(`${qrUrl}GetAtmQR`, request);
  }
  getReportsQRPayment(request: TransaccionDetail[]): Observable<Blob> {
    const { http, qrUrl } = this;
    return http.post(
      `${qrUrl}GetReport`, request,  { responseType: 'blob' });//ojosos postReport
  }
  getParameters(): Observable<ResultParameters>{
    const { http, qrUrl } = this;
    return http.post<ResultParameters>(`${qrUrl}GetParameters`, '');
  }
}
