import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { CompanyLimitsResult } from './models/company-limits-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LimitsService {

  private _limits: string;
  constructor(private http: HttpClient, private config: AppConfig){
    this._limits = this.config.getConfig('LimitsServiceUrl');
  }

  getCompanyLimits(): Observable<CompanyLimitsResult> {
    const {  _limits } = this;
    return this.http.post<CompanyLimitsResult>(`${_limits}Get`, '');
  }
}
