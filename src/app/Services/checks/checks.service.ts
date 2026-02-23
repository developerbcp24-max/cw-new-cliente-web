import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from '../../Jwt/jwt.service';
import { AppConfig } from '../../app.config';
import { CheckDto } from './models/check-dto';
import { CheckListDto } from './models/check-list-dto';
import { CheckResult, CheckListResult } from './models/check-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChecksService {
  private checks: string;

  constructor(private http: HttpClient, private config: AppConfig, private jwt: JwtService){
    this.checks = this.config.getConfig('ChecksServiceUrl');
  }

  getChecks(request: CheckListDto): Observable<CheckListResult> {
    const { http, checks } = this;
    return http.post<CheckListResult>(`${checks}GetChecks`, request);
  }

  getImage(request: CheckDto): Observable<CheckResult> {
    const { http, checks } = this;
    return http.post<CheckResult>(`${checks}GetImage`, request);
  }

  getReportCheck(request: CheckDto): Observable<Blob> {
    const { http, checks } = this;
    return http.post(`${checks}DownloadReport`, request, { responseType: 'blob'});
  }
}
