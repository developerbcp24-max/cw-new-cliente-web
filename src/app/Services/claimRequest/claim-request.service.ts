import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ClaimRequestDto } from './models/claim-request-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ClaimRequestDetail } from './models/claim-request-detail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ClaimRequestService {

  private claimRequestUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.claimRequestUrl = this.config.getConfig('ClaimRequestUrl');
  }

  GetAddresClaim(): Observable<ClaimRequestDto> {
    const { http, claimRequestUrl } = this;
    return http.post<ClaimRequestDto>(`${claimRequestUrl}GetAddresRepext`, '');
  }

  SaveClaimRequest(request: ClaimRequestDto): Observable<ProcessBatchResult> {
    const { http, claimRequestUrl } = this;
    return http.post<ProcessBatchResult>(`${claimRequestUrl}SaveClaimRequest`, request);
  }

  getDetail(request: any): Observable<ClaimRequestDetail> {
    const { claimRequestUrl } = this;
    return this.http.post<ClaimRequestDetail>(
      `${claimRequestUrl}GetDetailsClaimRequest`, request);
  }

}
