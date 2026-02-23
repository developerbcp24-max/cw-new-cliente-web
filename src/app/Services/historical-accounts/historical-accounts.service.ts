import { Injectable } from '@angular/core';
import { MovAccountsDto } from './models/MovAccountsDto';
import { AccountIni } from './models/AccountIni';
import { ParameterModel } from './models/ParameterModel';
import { AppConfig } from '../../app.config';
import { HistoricalAccountsResult } from './models/HistoricalAccountsResult';
import { NumberRowModel } from './models/NumberRowModel';
import { AccountPartialModel } from './models/AccountPartialModel';
import { HistoricalBasic } from './models/historical-basic';
import { MonthsResult } from './models/months-result';
import { MonthsDto } from './models/months-dto';
import { SaveHistoricalAccountDto } from './models/save-historical-account-dto';
import { ProcessBatchResult } from './models/process-batch-result';
import { HistoricalDetail } from './models/historical-detail';
import { ProcessBatchBasic } from './models/process-batch-basic';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';

@Injectable()
export class HistoricalAccountsService {


  private _UrlListHistorical: string;
  private _AccountList: string;

  constructor(
    private config: AppConfig,
    private http: HttpClient, private userService: UserService) {
      this._UrlListHistorical = this.config.getConfig('UrlListHistorical');
      this._AccountList = this.config.getConfig('AccountsServiceUrl');
      this.userService.getValidateCurrentUser();
    }

  getListHistorical(IniMov: MovAccountsDto): Observable<HistoricalAccountsResult> {
    const { _UrlListHistorical } = this;
    return this.http.post<HistoricalAccountsResult>(`${_UrlListHistorical}GetListAccountMovements`, IniMov);
  }
  getMonth(dto: MonthsDto): Observable<MonthsResult[]> {
    const { _UrlListHistorical } = this;
    return this.http.post<MonthsResult[]>(`${_UrlListHistorical}GetMonth`, dto);
  }
  getListAccount(modIni: AccountIni): Observable<AccountPartialModel[]> {
    const { _AccountList } = this;
    return this.http.post<AccountPartialModel[]>(
      `${_AccountList}Get`, modIni);
  }
  getNumberRowAccounts(model: HistoricalBasic): Observable<NumberRowModel> {
    const { _UrlListHistorical } = this;
    return this.http.post<NumberRowModel>(
      `${_UrlListHistorical}GetAccountMovementNumberRow`, model);
  }
  getCertificateType(): Observable<ParameterModel[]> {
    const { _UrlListHistorical } = this;
    return this.http.post<ParameterModel[]>(
      `${_UrlListHistorical}GetCertificateType`, null);
  }
  saveHistorical(SaveHistoricalDto: SaveHistoricalAccountDto): Observable<ProcessBatchResult> {
    const { _UrlListHistorical } = this;
    return this.http.post<ProcessBatchResult>(
      `${_UrlListHistorical}SaveHistorical`, SaveHistoricalDto);
  }
  getReportHistorical(dto: MovAccountsDto): Observable<Blob> {
    const { _UrlListHistorical } = this;
    return this.http.post(`${_UrlListHistorical}GetReport`, dto, { responseType: 'blob' });
  }
  getDetail(dto: ProcessBatchBasic): Observable<HistoricalDetail> {
    const { _UrlListHistorical } = this;
    return this.http.post<HistoricalDetail>(
      `${_UrlListHistorical}GetDetailsCertificateTransaction`, dto);
  }

  getShowTxtReport(): Observable<ParameterModel[]> {
    const { _UrlListHistorical } = this;
    return this.http.post<ParameterModel[]>(
      `${_UrlListHistorical}ShowTxtReport`, null);
  }

}

