import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig } from '../../app.config';
import { Transaction } from './models/ApiInfoEnrequecida';
import { ResponseData } from './models/ResponseData';
import { RequestDto } from './models/RequestDto';
import { RequestTransaction } from './models/RequestTransaction';
import { MovementDepositAbonoResponseModel } from './models/MovementDepositAbonoResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ApiInfoEnrequecidaService {
  private _UrlApiInfoEnrequecida: string;
  constructor(private config: AppConfig, private http: HttpClient){
    this._UrlApiInfoEnrequecida = this.config.getConfig('ApiInfoEnrequecidaUrl');
  }


  getListApiInfo(request: RequestDto): Observable<ResponseData> {
    const { _UrlApiInfoEnrequecida } = this;
    return this.http.post<ResponseData>(`${_UrlApiInfoEnrequecida}GetApiInfoResult`, request);
  }

   getReportsApiInfo(request: Transaction[]): Observable<Blob> {
    const { http, _UrlApiInfoEnrequecida } = this;
    return http.post(
      `${_UrlApiInfoEnrequecida}GetReport`, request,  { responseType: 'blob' });//ojosos postReport
  }
  getTransaction(request:RequestTransaction):Observable<MovementDepositAbonoResponseModel>{
    const { _UrlApiInfoEnrequecida } = this;
    return this.http.post<MovementDepositAbonoResponseModel>(`${_UrlApiInfoEnrequecida}GetTransaction`, request);
  }
  getReportTransaction(request:RequestTransaction): Observable<Blob> {
    const { _UrlApiInfoEnrequecida } = this;
    return this.http.post(`${_UrlApiInfoEnrequecida}GetReporte`, request, { responseType: 'blob' });
  }

}
