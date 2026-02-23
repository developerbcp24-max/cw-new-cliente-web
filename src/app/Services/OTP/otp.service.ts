import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { GetDatesDto } from './models/get-dates-dto';
import { GetDatesResult } from './models/get-dates-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionResult } from './models/session-result';
import { GetDatesAffilition } from './models/GetDatesAffilition';
import { GetCodeOTPResult } from './models/get-code-otp-result';

@Injectable({
  providedIn: 'root',

})
export class OtpService {
  private _otp: string;
  private _otpiam: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._otp = this.config.getConfig('OTPUrl');
    this._otpiam = this.config.getConfig('AffiliationUserCwUrl');
  }

  getUserDates(dto: GetDatesDto): Observable<GetDatesResult> {
    const { http, _otp } = this;
    return http.post<GetDatesResult>(`${_otp}GetUserDates`, dto, {
      withCredentials: true,
    });
  }

  getCodeOTP(dto: GetDatesDto): Observable<Response> {
    const { http, _otp } = this;
    return http.post<Response>(`${_otp}GetCodeOTP`, dto, {
      withCredentials: true,
    });
  }

  /* getCodeOTPAffiliation(dto: GetDatesAffilition): Observable<GetCodeOTPResult> {
    const { http, _otpiam } = this;
    return http.post<GetCodeOTPResult>(`${_otpiam}GetCodeOTPAffiliation`, dto, {
      withCredentials: true,
    });
  }
  validateCodeOTPIam(dto: GetDatesDto): Observable<Response> {
    const { http, _otpiam } = this;
    return http.post<Response>(`${_otpiam}ValidateCodeOTP`, dto, {
      withCredentials: true,
    });
  } */
 getCodeOTPAffiliation(dto: GetDatesAffilition): Observable<GetCodeOTPResult> {
    const { http, _otpiam } = this;
    return http.post<GetCodeOTPResult>(`${_otpiam}CreateDigitalFileAndSendOTP`, dto, {
      withCredentials: true,
    });
  }
  validateCodeOTPIam(dto: GetDatesDto): Observable<Response> {
    const { http, _otpiam } = this;
    return http.post<Response>(`${_otpiam}ValidateOTPDigitalFile`, dto, {
      withCredentials: true,
    });
  }
  validateCodeOTP(dto: GetDatesDto): Observable<Response> {
    const { http, _otp } = this;
    return http.post<Response>(`${_otp}ValidateCodeOTP`, dto, {
      withCredentials: true,
    });
  }

  getCodeOTPLogin(dto: GetDatesDto): Observable<Response> {
    const { http, _otp } = this;
    return http.post<Response>(`${_otp}GetCodeOTPLogin`, dto, {
      withCredentials: true,
    });
  }

  validateCodeOTPLogin(dto: GetDatesDto): Observable<Response> {
    const { http, _otp } = this;
    return http.post<Response>(`${_otp}ValidateCodeOTPLogin`, dto, {
      withCredentials: true,
    });
  }

  logoutSession(dto: SessionResult): Observable<boolean> {
    const { http, _otp } = this;
    return http.post<boolean>(`${_otp}Logout`, dto, { withCredentials: true });
  }
}
