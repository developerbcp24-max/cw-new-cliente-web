import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ModificationData } from './models/request-modification/modification-data';
import { OperationTypeResult } from './models/request-modification/operation-type-result';
import { OriginalData } from './models/request-modification/original-data';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { ProcessBatchId } from '../shared/models/process-batch-id';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModificationRequestService {

  private modificationRequestUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.modificationRequestUrl = this.config.getConfig('ModificationRequestUrl');
  }
  getOperationTypes(): Observable<OperationTypeResult[]> {
    return this.http.post<OperationTypeResult[]>(`${this.modificationRequestUrl}GetListOperationType`, '');
  }

  getOriginalData(): Observable<OriginalData> {
    return this.http.post<OriginalData>(`${this.modificationRequestUrl}DataFull`, '');
  }

  saveChanges(modificationData: ModificationData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this.modificationRequestUrl}SaveChanges`, modificationData);
  }

  getDetail(request: ProcessBatchId): Observable<OriginalData> {
    return this.http.post<OriginalData>(`${this.modificationRequestUrl}GetDetail`, request);
  }
}
