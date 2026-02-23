import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import { RatesResult } from './models/rates-result';
import { PublicWritingDetailResult } from './models/public-writing-detail-result';
import { TimeDepositResult } from './models/time-deposit-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ParametersResult } from './models/parameters-result';
import { GetBatchDto } from './models/get-batch-dto';
import { RatesDto } from './models/rates-dto';
import { BallotOfWarrantyDto } from './models/ballot-of-warranty-dto';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NewBallotOfWarrantyService {

  private _newBallotOfWarranty: string;
  constructor(private config: AppConfig, private http: HttpClient){
    this._newBallotOfWarranty = this.config.getConfig('NewBallotOfWarrantyUrl');
  }


  getParameters(): Observable<ParametersResult> {
    const { http, _newBallotOfWarranty } = this;
    return http.post<ParametersResult>(`${_newBallotOfWarranty}GetParameters`, '');
  }

  getPublicWritingDetail(): Observable<PublicWritingDetailResult[]> {
    const { http, _newBallotOfWarranty } = this;
    return http.post<PublicWritingDetailResult[]>(`${_newBallotOfWarranty}GetPublicWritingDetail`, '');
  }

  getTimeDeposit(): Observable<TimeDepositResult[]> {
    const { http, _newBallotOfWarranty } = this;
    return http.post<TimeDepositResult[]>(`${_newBallotOfWarranty}GetTimeDeposit`, '');
  }

   GetContract(request: BallotOfWarrantyDto): Observable<Blob> {
     const { http, _newBallotOfWarranty } = this;
     return http.post(`${_newBallotOfWarranty}GetContract`, request, { responseType: 'blob' });
   }

  Save(dto: BallotOfWarrantyDto): Observable<ProcessBatchResult> {
    const { http, _newBallotOfWarranty } = this;
    return http.post<ProcessBatchResult>(`${_newBallotOfWarranty}Save`, dto);
  }

  getDetail(dto: GetBatchDto): Observable<BallotOfWarrantyDto> {
    const { http, _newBallotOfWarranty } = this;
    return http.post<BallotOfWarrantyDto>(`${_newBallotOfWarranty}GetDetail`, dto);
  }

  getRates(dto: RatesDto): Observable<RatesResult> {
    const { http, _newBallotOfWarranty } = this;
    return http.post<RatesResult>(`${_newBallotOfWarranty}GetRates`, dto);
  }

}
