import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { BatchIdDto } from '../shared/models/batch-id-dto';
import { Observable } from 'rxjs';
import { QrPaymentAchDetail } from './Models/qr-payment-ach';

@Injectable({
  providedIn: 'root',
})
export class QrPaymentAchService {
  private _transfers: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._transfers = this.config.getConfig('QrPaymentAchServiceUrl');
  }

  getDetail(batchId: BatchIdDto): Observable<QrPaymentAchDetail> {
    const { _transfers } = this;
    return this.http.post<QrPaymentAchDetail>(
      `${_transfers}GetDetails`,
      batchId
    );
  }
}
