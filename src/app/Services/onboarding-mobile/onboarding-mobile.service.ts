import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig } from '../../app.config';
import { GetOnboardingMobileDataRequest } from './Models/GetOnboardingMobileDataRequest';
import { GetOnboardingMobileDataResponse } from './Models/GetOnboardingMobileDataResponse';
import { CreateDigitalFileAndSendOTPResponse } from './Models/CreateDigitalFileAndSendOTPResponse';
import { CreateDigitalFileAndSendOTPRequest } from './Models/CreateDigitalFileAndSendOTPRequest';
import { ValidateOTPDigitalFileRequest } from './Models/ValidateOTPDigitalFileRequest';
import { GetRespPassiveLiveTestRequest } from './Models/GetRespPassiveLiveTestRequest';
import { GetRespPassiveLiveTestResponse } from './Models/GetRespPassiveLiveTestResponse';
import { GetValidatePassiveLiveTestRequest } from './Models/GetValidatePassiveLiveTestRequest';
import { GetValidatePassiveLiveTestResponse } from './Models/GetValidatePassiveLiveTestResponse';
import { DigitalFileReSendOTPRequest } from './Models/DigitalFileReSendOTPRequest';
import { Result } from '../shared/models/result';
import { SaveFinalDataToCWAffRequest } from './Models/SaveFinalDataToCWAffRequest';

@Injectable({
  providedIn: 'root',
})
export class OnboardingMobileService {
  private _getOnboardingMobileDataUrl: string;
  private _createDigitalFileAndSendOTPUrl: string;
  private _validateOTPDigitalFileUrl: string;
  private _getRespPassiveLiveTestUrl: string;
  private _getValidatePassiveLiveTestUrl: string;
  private _digitalFileReSendOTPUrl: string;
  private _saveFinalDataToCWAffUrl: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._getOnboardingMobileDataUrl =
      this.config.getConfig('OnboardingMobile').GetOnboardingMobileDataUrl;
    this._createDigitalFileAndSendOTPUrl =
      this.config.getConfig('OnboardingMobile').CreateDigitalFileAndSendOTPUrl;
    this._validateOTPDigitalFileUrl =
      this.config.getConfig('OnboardingMobile').ValidateOTPDigitalFileUrl;
    this._getRespPassiveLiveTestUrl =
      this.config.getConfig('OnboardingMobile').GetRespPassiveLiveTestUrl;
    this._getValidatePassiveLiveTestUrl =
      this.config.getConfig('OnboardingMobile').GetValidatePassiveLiveTestUrl;
    this._digitalFileReSendOTPUrl =
      this.config.getConfig('OnboardingMobile').DigitalFileReSendOTPUrl;
    this._saveFinalDataToCWAffUrl =
      this.config.getConfig('OnboardingMobile').SaveFinalDataToCWAffUrl;
  }

  getOnboardingMobileData(
    dto: GetOnboardingMobileDataRequest
  ): Observable<GetOnboardingMobileDataResponse> {
    const { http, _getOnboardingMobileDataUrl } = this;
    return http.post<GetOnboardingMobileDataResponse>(
      _getOnboardingMobileDataUrl,
      dto,
      { withCredentials: true }
    );
  }

  createDigitalFileAndSendOTP(
    dto: CreateDigitalFileAndSendOTPRequest
  ): Observable<CreateDigitalFileAndSendOTPResponse> {
    const { http, _createDigitalFileAndSendOTPUrl } = this;
    return http.post<CreateDigitalFileAndSendOTPResponse>(
      _createDigitalFileAndSendOTPUrl,
      dto,
      { withCredentials: true }
    );
  }

  validateOTPDigitalFile(
    dto: ValidateOTPDigitalFileRequest
  ): Observable<Result<boolean>> {
    const { http, _validateOTPDigitalFileUrl } = this;
    return http.post<Result<boolean>>(_validateOTPDigitalFileUrl, dto, {
      withCredentials: true,
      headers: { 'Return-Complete-Body': 'true' },
    });
  }

  digitalFileReSendOTP(
    dto: DigitalFileReSendOTPRequest
  ): Observable<CreateDigitalFileAndSendOTPResponse> {
    const { http, _digitalFileReSendOTPUrl } = this;
    return http.post<CreateDigitalFileAndSendOTPResponse>(
      _digitalFileReSendOTPUrl,
      dto,
      {
        withCredentials: true,
      }
    );
  }

  getRespPassiveLiveTest(
    dto: GetRespPassiveLiveTestRequest
  ): Observable<GetRespPassiveLiveTestResponse> {
    const { http, _getRespPassiveLiveTestUrl } = this;
    return http.post<GetRespPassiveLiveTestResponse>(
      _getRespPassiveLiveTestUrl,
      dto,
      { withCredentials: true }
    );
  }

  getValidatePassiveLiveTest(
    dto: GetValidatePassiveLiveTestRequest
  ): Observable<GetValidatePassiveLiveTestResponse> {
    const { http, _getValidatePassiveLiveTestUrl } = this;
    return http.post<GetValidatePassiveLiveTestResponse>(
      _getValidatePassiveLiveTestUrl,
      { ...dto, avoidLoader: true },
      { withCredentials: true }
    );
  }

  SaveFinalDataToCWAff(dto: SaveFinalDataToCWAffRequest): Observable<void> {
    const { http, _saveFinalDataToCWAffUrl } = this;
    return http.post<void>(_saveFinalDataToCWAffUrl, dto, {
      withCredentials: true,
    });
  }
}
