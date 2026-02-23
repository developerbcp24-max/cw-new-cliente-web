import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { GetCriteriaResponse } from './models/get-criteria-response';
import { Observable } from 'rxjs';
import { GetDebtsDto } from './models/get-debts-dto';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EpsasService {

  private epsasUrl: string;

  constructor(private config: AppConfig, private http: HttpClient) {
    this.epsasUrl = this.config.getConfig('EpsasUrl');
  }

  getCriteria(): Observable<GetCriteriaResponse> {
    const { http, epsasUrl } = this;
    return http.post<GetCriteriaResponse>(`${epsasUrl}GetCriteria`, '');
  }

  getDebts(request: GetDebtsDto): Observable<any> {
    const { http, epsasUrl } = this;
    return http.post<any>(`${epsasUrl}GetDebts`, request);
  }

}
