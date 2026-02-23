import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from '../../Jwt/jwt.service';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from '../..//app.config';
//import { ReCaptchaV3Service } from 'ng-recaptcha';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private serviceAccountUrl: string;

  constructor(private _jwt: JwtService, private _http: HttpClient,
    private authenticationService: AuthenticationService,
    private config: AppConfig, /* private recaptchaV3Service: ReCaptchaV3Service, */) {
      this.serviceAccountUrl = this.config.getConfig('AuthUrl') + 'api/Account/';
  }

    newRefreshToken(): Promise<any> {
      return this._http.post<any>(`${this.serviceAccountUrl}RefreshToken`, null, { withCredentials: true }).toPromise();
    }
}
