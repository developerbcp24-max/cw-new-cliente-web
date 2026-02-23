import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
//import { AppConfig } from 'src/app/app.config';
import { BanksResult } from '../mass-payments/Models/banks-result';
import { BranchOfficeResult } from '../mass-payments/Models/branch-office-result';
import { EventLogRequest } from '../mass-payments/Models/event-log-request';
import { ClientRequest } from './models/client-request';
import { ClientResult } from './models/client-result';
import { MonthsQuantityDto } from './models/months-quantity-dto';
import { MonthsResult } from './models/months-result';
import { ParameterDto } from './models/parameter-dto';
import { ParameterResult } from './models/parameter-result';
import { ValidPasswordExpiration } from './models/ValidPasswordExpiration';
import { RenewPassword } from './models/RenewPassword';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  private _parameters: string;
  private _logs: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._parameters = this.config.getConfig('ParametersServiceUrl');
    this._logs = this.config.getConfig('EventLogServiceUrl');
  }

  getByGroupAndCode(dto: ParameterDto): Observable<ParameterResult> {
    const { http, _parameters } = this;
    return http.post<ParameterResult>(`${_parameters}GetByGroupAndCode`, dto);
  }

  getListByGroupAndCode(dto: ParameterDto): Observable<ParameterResult[]> {
    const { http, _parameters } = this;
    return http.post<ParameterResult[]>(`${_parameters}GetListByGroupAndCode`, dto);
  }

  getByGroup(dto: ParameterDto): Observable<ParameterResult[]> {
    const { http, _parameters } = this;
    return http.post<ParameterResult[]>(`${_parameters}GetByGroup`, dto);
  }

  getBranchOffices(): Observable<BranchOfficeResult[]> {
    const { http, _parameters } = this;
    return http.post<BranchOfficeResult[]>(`${_parameters}GetBranchOffices`, '');
  }

  getBankList(): Observable<BanksResult[]> {
    const { http, _parameters } = this;
    return http.post<BanksResult[]>(`${_parameters}GetBanks`, '');
  }

  getMonths(dto: MonthsQuantityDto): Observable<MonthsResult[]> {
    const { http, _parameters } = this;
    return http.post<MonthsResult[]>(`${_parameters}GetMonths`, dto);
  }
  getBankListNotBcp(): Observable<BanksResult[]> {
    const { http, _parameters } = this;
    return http.post<BanksResult[]>(`${_parameters}GetBanksNotBcp`, '');
  }

  getValidateCompanyId(): Observable<boolean> {
    const { http, _parameters } = this;
    return http.post<boolean>(`${_parameters}GetValidateCompanyId`, '');
  }

  getValidateClient(): Observable<ClientResult> {
    const { http, _parameters } = this;
    return http.post<ClientResult>(`${_parameters}GetValidateClient`, '');
  }

  getClientUpdate(dto: ClientRequest): Observable<string> {
    const { http, _parameters } = this;
    return http.post<string>(`${_parameters}GetClientUpdate`, dto);
  }

  saveEventLog(dto: EventLogRequest): Observable<string> {
    const { http, _logs } = this;
    return http.post<string>(`${_logs}SaveEventLog`, dto);
  }

  getInfoPass(): Observable<ValidPasswordExpiration>{
    const { http, _parameters} = this;
    return http.post<ValidPasswordExpiration>(`${_parameters}GetInfoPass`, '' )
  }

  getRenewPass(): Observable<RenewPassword>{
    const { http, _parameters} = this;
    return http.post<RenewPassword>(`${_parameters}GetRenewPass`, '' )
  }
}
