import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
//import { AppConfig } from 'src/app/app.config';
import { UifcwDto } from './models/uifcw-dto';
import { UifcwResult } from './models/uifcw-result';
import { UifMultipleDto } from './models/uif-multiple-dto';
import { BatchUIFRegistered } from './models/batch-uif-registered';
import { BatchUIFResult } from './models/batch-uif-result';
import { ProcessBatchDto } from '../shared/models/process-batch';
import { UifDto } from '../shared/models/uif-dto';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class UifService {

  private _uif: string;

  constructor(private http: HttpClient, @Inject(AppConfig) private config: AppConfig){
    this._uif = this.config.getConfig('UIFServiceUrl');
  }

  IsValidUIF(request: UifcwDto[]): Observable<UifcwResult[]> {
    return this.http.post<UifcwResult[]>(`${this._uif}IsValidUIF`, request);
  }

  IsValidMultipleUIF(request: UifMultipleDto): Observable<UifcwResult[]> {
    return this.http.post<UifcwResult[]>(`${this._uif}VerifyMultipleUIF`, request);
  }

  verifyUifPendingPayments(request: BatchUIFRegistered[]): Observable<BatchUIFResult[]> {
    return this.http.post<BatchUIFResult[]>(`${this._uif}VerifyUifPendingPayments`, request);
  }

  updateUifDeclarations(request: BatchUIFRegistered): Observable<string> {
    return this.http.post<string>(`${this._uif}UpdateUifDeclarations`, request);
  }

  validateOriginDestinationUif(request: ProcessBatchDto): Observable<string> {
    return this.http.post<string>(`${this._uif}ValidateOriginDestinationUif`, request);
  }

  getMultipleAmounts(request: UifDto): Observable<UifMultipleDto> {
    return this.http.post<UifMultipleDto>(`${this._uif}GetMultipleAmounts`, request);
  }
}

