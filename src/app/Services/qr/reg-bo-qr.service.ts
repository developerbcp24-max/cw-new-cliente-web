import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { BusinesBranchId } from './models/BusinesBranchId';
import { AdminQRPaymentData } from './models/AdminQRPaymentData';
import { ClientResponseUser } from './models/ClientResponseUser';
import { UpBraAtmhUserQr } from './models/UpBraAtmhUserQr';

@Injectable({
  providedIn: 'root'
})
export class RegBoQrService {
  private regQrUrl: string;
  constructor(private http: HttpClient, private config: AppConfig) {
    this.regQrUrl = this.config.getConfig('RegBoQrServicesUrl');
  }

  regBusinessQR(): Observable<any> {
    const { http, regQrUrl } = this;
    return http.post(`${regQrUrl}GetRegBusiness`, '');
  }

  getUsersQr(request: BusinesBranchId): Observable<ClientResponseUser[]>{
    const { http, regQrUrl } = this;
    return http.post<ClientResponseUser[]>(`${regQrUrl}GetUserQR`, request);
  }
  regUsersQr(request: AdminQRPaymentData): Observable<AdminQRPaymentData>{
    const { http, regQrUrl } = this;
    return http.post<AdminQRPaymentData>(`${regQrUrl}RegUsers`,  request);
  }

  regBranchQr(request: AdminQRPaymentData): Observable<AdminQRPaymentData>{
    const { http, regQrUrl } = this;
    return http.post<AdminQRPaymentData>(`${regQrUrl}SaveRegBranch`,  request);
  }

  regAtmhQr(request: AdminQRPaymentData): Observable<AdminQRPaymentData>{
    const { http, regQrUrl } = this;
    return http.post<AdminQRPaymentData>(`${regQrUrl}SaveRegAtm`,  request);
  }

  upBraAtmhUserQr(request: UpBraAtmhUserQr): Observable<UpBraAtmhUserQr>{
    const { http, regQrUrl } = this;
    return http.post<UpBraAtmhUserQr>(`${regQrUrl}UpdateBAU`,  request);
  }


}
