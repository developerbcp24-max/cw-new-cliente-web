import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { PendingBatchResult } from './models/pending-batch-result';
import { ProcessBatch } from './models/process-batch';
import { BatchStatus } from './models/batch-status';
import { Constants } from '../shared/enums/constants';
import { PaginationDto } from './models/pagination-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationService {

  private authorization: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.authorization = this.config.getConfig('AuthorizationServiceUrl');
  }

  getPendingBatches(dto: PaginationDto): Observable<PendingBatchResult> {
    const { authorization } = this;
    return this.http.post<PendingBatchResult>(`${authorization}GetPendingBatches`, dto);
  }

  processBatches(dto: ProcessBatch): Observable<BatchStatus[]> {
    const { authorization } = this;
    return dto.operation == Constants.rejectionOperation ? this.http.post<BatchStatus[]>(`${authorization}RejectBatches`, dto) :
      this.http.post<BatchStatus[]>(`${authorization}ProcessBatches`, dto);
  }
}
