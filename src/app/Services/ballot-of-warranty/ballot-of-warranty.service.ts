import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { RatesResult } from './models/rates-result';
import { PublicWritingDetailResult } from './models/public-writing-detail-result';
import { TimeDepositResult } from './models/time-deposit-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ParametersResult } from './models/parameters-result';
import { BallotOfWarrantyDto } from './models/ballot-of-warranty-dto';
import { GetBatchDto } from './models/get-batch-dto';
import { RatesDto } from './models/rates-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BallotOfWarrantyService {

  private _ballotOfWarranty: string;
  constructor(private config: AppConfig, private http: HttpClient){
    this._ballotOfWarranty = this.config.getConfig('BallotOfWarrantyUrl');
  }

  getParameters(): Observable<ParametersResult> {
    const { http, _ballotOfWarranty } = this;
    return http.post<ParametersResult>(`${_ballotOfWarranty}GetParameters`, '');
  }

  getPublicWritingDetail(): Observable<PublicWritingDetailResult[]> {
    const { http, _ballotOfWarranty } = this;
    return http.post<PublicWritingDetailResult[]>(`${_ballotOfWarranty}GetPublicWritingDetail`, '');
  }

  getTimeDeposit(): Observable<TimeDepositResult[]> {
    const { http, _ballotOfWarranty } = this;
    return http.post<TimeDepositResult[]>(`${_ballotOfWarranty}GetTimeDeposit`, '');
  }

   GetContract(request: BallotOfWarrantyDto): Observable<Blob> {
     const { http, _ballotOfWarranty } = this;
     return http.post(`${_ballotOfWarranty}GetContract`, request, { responseType: 'blob' });
   }

  Save(dto: BallotOfWarrantyDto): Observable<ProcessBatchResult> {
    const { http, _ballotOfWarranty } = this;
    return http.post<ProcessBatchResult>(`${_ballotOfWarranty}Save`, dto);
  }

  getDetail(dto: GetBatchDto): Observable<BallotOfWarrantyDto> {
    const { http, _ballotOfWarranty } = this;
    return http.post<BallotOfWarrantyDto>(`${_ballotOfWarranty}GetDetail`, dto);
  }

  getRates(dto: RatesDto): Observable<RatesResult> {
    const { http, _ballotOfWarranty } = this;
    return http.post<RatesResult>(`${_ballotOfWarranty}GetRates`, dto);
  }
}
