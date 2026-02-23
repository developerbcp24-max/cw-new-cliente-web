import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { TrackTransfersDto } from './models/track-transfers-dto';
import { TrackTransfersResult } from './models/track-transfers-result';
import { TrackStatusResult } from './models/track-status-result';
import { OperationTypeResult } from './models/operation-type-result';
import { HttpClient } from '@angular/common/http';
import { ParameterResult } from '../parameters/models/parameter-result';

@Injectable()
export class TrackTransfersService {
  private trackTransfers: string;
  private newTrackTransfers: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.trackTransfers = this.config.getConfig('TrackTransfersUrl');
    this.newTrackTransfers = this.config.getConfig('NewTrackTrackingUrl');
  }

  trackingListParameters(request: TrackTransfersDto): Observable<TrackTransfersResult[]> {
    const { http, trackTransfers} = this;
    return http.post<TrackTransfersResult[]>(`${trackTransfers}TrackingListParameters`, request);
  }

  getReportOperations(request: TrackTransfersDto): Observable<Blob> {
    const { http, trackTransfers } = this;
    return http.post(`${trackTransfers}GetReport`, request, { responseType: 'blob' });//ojosos postReport
  }

  getOperationStatus(): Observable<TrackStatusResult[]> {
    const { http, trackTransfers } = this;
    return http.post<TrackStatusResult[]>(`${trackTransfers}GetOperationStatus`, '');
  }

  getOperationTypes(): Observable<OperationTypeResult[]> {
    const { http, trackTransfers } = this;
    return http.post<OperationTypeResult[]>(`${trackTransfers}GetOperationTypes`, '');
  }

  getBatchUserValidation(request: TrackStatusResult): Observable<ParameterResult> {
    const { http, trackTransfers } = this;
    return http.post<ParameterResult>(`${trackTransfers}GetBatchUserValidation`, request);
  }
  getBatchUserValidSignature(request: TrackStatusResult): Observable<ParameterResult> {
    const { http, newTrackTransfers } = this;
    return http.post<ParameterResult>(`${newTrackTransfers}ValidateUserSignature`, request);
  }
}
