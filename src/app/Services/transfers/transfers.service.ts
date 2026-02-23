import { Injectable } from '@angular/core';
import { FavoriteTransferRequest } from './models/favorite-transfer-request';
import { FavoriteTransferIdRequest } from './models/favorite-transfer-id-request';
import { AppConfig } from '../../app.config';
import { TransferData } from './models/transfer-data';
import { FavoriteTransferResponse } from './models/favorite-transfer-response';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { TransferDetail } from './models/transfer-detail';
import { BatchIdDto } from './models/batch-id-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {

  private _transfers: string;
  private _favoriteTransfers: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._transfers = this.config.getConfig('TransfersServiceUrl');
    this._favoriteTransfers = this.config.getConfig('FavoriteTransfersServiceUrl');
  }

  save(request: TransferData): Observable<ProcessBatchResult> {
    const {  _transfers } = this;
    return this.http.post<ProcessBatchResult>(`${_transfers}SaveTransfer`, request);
  }

  getFavorites(): Observable<FavoriteTransferResponse[]> {
    const {  _favoriteTransfers } = this;
    return this.http.post<FavoriteTransferResponse[]>(`${_favoriteTransfers}Get`, '');
  }

  getDetail(batchId: BatchIdDto): Observable<TransferDetail> {
    const {  _transfers } = this;
    return this.http.post<TransferDetail>(`${_transfers}GetDetail`, batchId);
  }

  updateFavorite(request: FavoriteTransferRequest): Observable<Response> {
    const {  _favoriteTransfers } = this;
    return this.http.post<Response>(`${_favoriteTransfers}Update`, request);
  }

  updateFavoriteAch(request: FavoriteTransferRequest): Observable<Response> {
    const {  _favoriteTransfers } = this;
    return this.http.post<Response>(`${_favoriteTransfers}UpdateAch`, request);
  }

  removeFavorite(request: FavoriteTransferIdRequest): Observable<Response> {
    const {  _favoriteTransfers } = this;
    return this.http.post<Response>(`${_favoriteTransfers}Remove`, request);
  }
}
