import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { RequestModelPaseAccount,RequestModelPaseDetail,RequestModelHeadPase,RequestModelReportsPase } from './Models/Request-model-pase';
import { ResponseModelDate } from './Models/response-model-date';
import { ResponseModelPaseHead } from './Models/ResponseModelPaseHead';
import { ResponseModelPaseDetail } from './Models/ResponseModelPaseDetail';
import { ResponseModelPaseAccount } from './Models/response-model-pase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';

@Injectable()
export class ConsultorsPaseService {
  private _UrlPase: string;

  constructor(
    private http: HttpClient,
    private config: AppConfig, private userService: UserService) {
      this._UrlPase = this.config.getConfig('PaseUrl');
      this.userService.getValidateCurrentUser();
    }

  getAccountRoles(request: RequestModelPaseAccount): Observable<ResponseModelPaseAccount[]> {
    const { http, _UrlPase } = this;
    return http.post<ResponseModelPaseAccount[]>(
      `${_UrlPase}GetAccountRol`, request);
  }

  getDetailPase(request: RequestModelPaseDetail): Observable<ResponseModelPaseDetail[]> {
    const { http, _UrlPase } = this;
    return http.post<ResponseModelPaseDetail[]>(
      `${_UrlPase}GetBringOperationPase`, request);

  }
  getDetailHeadPase(request: RequestModelHeadPase): Observable<ResponseModelPaseHead[]> {
    const { http, _UrlPase } = this;
    return http.post<ResponseModelPaseHead[]>(
      `${_UrlPase}GetBringOperationHeadPase`, request);
  }

  getMonth(): Observable<ResponseModelDate[]> {
    const { http, _UrlPase } = this;
    return http.post<ResponseModelDate[]>(
      `${_UrlPase}BringMonth`, '');
  }

  getReportsPase(request: RequestModelReportsPase): Observable<Blob> {
    const { http, _UrlPase } = this;
    return http.post(
      `${_UrlPase}GetReport`, request, { responseType: 'blob' });//ojosos postReport
  }

}
