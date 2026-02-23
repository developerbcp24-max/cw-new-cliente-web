import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { FavoritePaymentsData } from './Models/favorite-payments/favorite-payments-data';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { FavoritePaymentsSpreadsheetsResult } from './Models/favorite-payments/favorite-payments-spreadsheets-result';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { AccountClientDto } from './Models/account-client-dto';
import { AccountClientResult } from './Models/account-client-result';
import { AccountProviderDto } from './Models/account-provider-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritePaymentsService {
  private _favoritePayment: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._favoritePayment = this.config.getConfig('FavoritePaymentServiceUrl');
  }

  getForm(): Observable<MassivePaymentsPreviousFormResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${_favoritePayment}GetForm`, '');
  }

  getPreviousForm(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${_favoritePayment}GetPreviousFavoriteForm`, request);
  }

  getManualChargeForm(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${_favoritePayment}GetPreviousManualFavoriteForm`, request);
  }

  saveConfiguration(request: FavoritePaymentsData): Observable<ProcessBatchResult> {
    const {  _favoritePayment } = this;
    return this.http.post<ProcessBatchResult>(`${_favoritePayment}SaveConfigurationFavoritePayment`, request);
  }

  chargeFormFavorite(request: any): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${_favoritePayment}LoadMassPayRoll`, request);//ojosos post file
  }

  chargeFormConfigurationFavorite(request: any): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${_favoritePayment}LoadPayRoll`, request);//ojosos postfile
  }

  verifySalariesAccounts(request: AccountClientDto[]): Observable<AccountClientResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<AccountClientResult[]>(`${_favoritePayment}VerifySalariesAccount`, request);
  }

  verifyProvidersAccounts(request: AccountProviderDto[]): Observable<AccountClientResult[]> {
    const {  _favoritePayment } = this;
    return this.http.post<AccountClientResult[]>(`${_favoritePayment}VerifyProvidersAccount`, request);
  }

  getDetailMassFavorite(request: any): Observable<FavoritePaymentsData> {
    const {  _favoritePayment } = this;
    return this.http.post<FavoritePaymentsData>(`${_favoritePayment}GetDetailMassFavorite`, request);//ojosos postfile
  }

  getDetailFavorite(request: any): Observable<FavoritePaymentsData> {
    const {  _favoritePayment } = this;
    return this.http.post<FavoritePaymentsData>(`${_favoritePayment}GetDetailFavorite`, request);//ojosos postfile
  }

  getManualSpreadsheets(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._favoritePayment}GetManualForm`, request);
  }

  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._favoritePayment}GetForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._favoritePayment}GetPreviousForm`, request);
  }

  save(request: FavoritePaymentsData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._favoritePayment}SaveFavoritePayment`, request);
  }

  verifyAccount(request: AccountClientDto): Observable<AccountClientResult> {
    return this.http.post<AccountClientResult>(`${this._favoritePayment}VerifyAccount`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<FavoritePaymentsSpreadsheetsResult[]> {
    return this.http.post<FavoritePaymentsSpreadsheetsResult[]>(`${this._favoritePayment}LoadPayRoll`, request);//ojosos postfile
  }

  getPaymentDetail(request: MassivePaymentsSpreadsheetsDto): Observable<FavoritePaymentsData> {
    return this.http.post<FavoritePaymentsData>(`${this._favoritePayment}GetDetail`, request);
  }
}
