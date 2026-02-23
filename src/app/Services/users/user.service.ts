import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { JwtService } from '../../Jwt/jwt.service';
import { NewUserPassword } from './models/new-password-model';
import { ChangePasswordModel } from './models/change-password-model';
import { ValidatePinModel } from './models/validate-pin-model';
import { CurrentUser } from './models/current-user';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { NewUserAlias } from './models/NewUserAlias';
import { AppConfig } from '../../app.config';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { JwtFieldEncryptionService } from './jwt-field-encryption.service';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}
@Injectable()
export class UserService {

  private menu = 'config/menu.json';

/*   constructor(
    private _jwt: JwtService,
    private _http: HttpClient,
    private authenticationService: AuthenticationService,
    private config: AppConfig,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {} */
  private serviceAccountUrl: string;
  private serviceAccountNewUrl: string;
  private keySiteRecaptcha: string
  readonly isNewJwt: boolean;

  constructor(
    private _jwt: JwtService,
    private _http: HttpClient,
    private authenticationService: AuthenticationService,
    private config: AppConfig,
    private recaptchaV3Service: ReCaptchaV3Service,
    private _jwtFieldEncryptionService: JwtFieldEncryptionService,
  ) {
    this.serviceAccountUrl = this.config.getConfig('AuthUrl') + 'api/Account/';
    this.serviceAccountNewUrl = this.config.getConfig('NewAuthUrl');
    this.isNewJwt = this.config.getConfig('IsPasswordNewJwt');
    this.keySiteRecaptcha = this.config.getConfig('publicKeyRecaptcha')
  }
  getUserInfo(id: string): Observable<Response> {
    return this._http.get<Response>(
      `${this.serviceAccountUrl}UserInfo` + '?id=' + id
    );
  }

  validatePin(validatePinModel: ValidatePinModel): Observable<any> {
    return this._http.post<any>(
      `${this.serviceAccountUrl}ValidatePin`,
      validatePinModel,
      { withCredentials: true }
    );
  }

  validateNewPassword(newPassword: NewUserPassword): Observable<Response> {
    return this._http.post<Response>(
      `${this.serviceAccountUrl}ValidateNewPassword`,
      newPassword,
      { withCredentials: true }
    );
  }
  validateNewAlias(newAlias: NewUserAlias): Observable<Response> {
    return this._http.post<Response>(
      `${this.serviceAccountUrl}ValidateUserStock`,
      newAlias,
      { withCredentials: true }
    );
  }

  createPassword(newPassword: NewUserPassword): Observable<Response> {
    if(this.isNewJwt){
      return this._http.post<Response>(`${this.serviceAccountNewUrl}CreatePassword`, newPassword, { withCredentials: true });
    }else{
      return this._http.post<Response>(`${this.serviceAccountUrl}CreatePassword`, newPassword, { withCredentials: true });
    }
  }

  createAlias(newPassword: NewUserAlias): Observable<Response> {
    return this._http.post<Response>(
      `${this.serviceAccountUrl}CreateUserAlias`,
      newPassword,
      { withCredentials: true }
    );
  }
  changePassword(changePasswd: ChangePasswordModel): Observable<Response> {
    if(this.isNewJwt){
      return this._http.post<Response>(`${this.serviceAccountNewUrl}ChangePassword`, changePasswd, { withCredentials: true });
    }else{
      return this._http.post<Response>(`${this.serviceAccountUrl}ChangePassword`, changePasswd, { withCredentials: true });
    }
  }

  decryptPasswordAES(): Observable<Response> {
    return this._http.post<Response>(
      `${this.serviceAccountUrl}DecryptPasswordAES`,
      null,
      { withCredentials: true }
    );
  }

  getMenu(): Observable<Response> {
    const { _http, menu } = this;
    return _http.get<Response>(`${menu}`);
  }

  getValidateCurrentUser() {
    const validateSession = this.config.getConfig('validateSession');
    const newJwt = this.config.getConfig('IsNewJwt');
    if (validateSession && !newJwt) {
      const currentUser = this.getUserToken();
      const isRecaptcha = this.config.getConfig('isRecaptcha');
      if (currentUser?.guid?.length > 0) {
        if (isRecaptcha) {
          this.getNewRecaptcha().then((res) => {
            let recaptchaValueVerify = res;
            let recaptchaValue = res;
            this.authenticationService
              .login(
                currentUser.unique_name,
                currentUser.unique_name,
                recaptchaValue,
                recaptchaValueVerify,
                currentUser.guid
              )
              .subscribe({
                next: (result) => {
                  //console.log('verificando', result);
                },
                error: (_err) => {
                  //console.log('error', _err);
                },
              });
          });
        }
      }
    }
  }

  getUserToken(): CurrentUser {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);
    if (!user || user == null) {
      this.authenticationService.logout();
    }
    const token = user.token;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    let data = JSON.parse(window.atob(base64));
    data.user_name=this._jwtFieldEncryptionService.decryptField(data.user_name);
    data.user_document_number=this._jwtFieldEncryptionService.decryptField(data.user_document_number);
    return data as CurrentUser;
  }
getUserTokenActive(): boolean {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);
    if (!user || user == null) {
      return false;
    }else{
      return true;
    }


  }
  getCaptcha(): Observable<Response> {
    const { _http, serviceAccountUrl } = this;
    return _http.post<Response>(
      `${serviceAccountUrl}GetCaptcha`,
      {},
      { withCredentials: true }
    );
  }

  getRecaptcha(): PromiseLike<any> {
    const win = window['grecaptcha'];
    const key = this.config.getConfig('publicKeyRecaptcha');
    let resp = win.execute(key, { action: 'login' });

    return resp;
  }

      /* async getNewRecaptcha(action: string = 'login'): Promise<string> {
        try {
          await this.waitForRecaptcha();
          const token = await firstValueFrom(this.recaptchaV3Service.execute(action));
          return token;
        } catch (error) {
          //console.error('Error al generar el token de reCAPTCHA:', error);
          throw new Error('No se pudo generar el token de reCAPTCHA');
        }
      } */
        async getNewRecaptcha(action: string = 'login'): Promise<string> {
          try {
            await this.waitForRecaptcha();

            // Convertimos el callback a Promise
            const token = await new Promise<string>((resolve, reject) => {
              this.recaptchaV3Service.execute(
                this.keySiteRecaptcha, // Asegúrate de inyectar esto o usar environment
                action,
                (token) => resolve(token),
                {}, // Configuración opcional
                (error) => reject(error)
              );
            });

            return token;
          } catch (error) {
            //console.error('Error al generar el token de reCAPTCHA:', error);
            throw new Error('No se pudo generar el token de reCAPTCHA');
          }
        }

      private waitForRecaptcha(): Promise<void> {
        return new Promise((resolve, reject) => { // Agregado el parámetro reject
          if (window.grecaptcha?.ready) {
            window.grecaptcha.ready(resolve);
          } else {
            // Verificar cada 100ms si reCAPTCHA está disponible
            const checkRecaptcha = setInterval(() => {
              if (window.grecaptcha?.ready) {
                clearInterval(checkRecaptcha);
                window.grecaptcha.ready(resolve);
              }
            }, 100);

            // Timeout después de 10 segundos
            setTimeout(() => {
              clearInterval(checkRecaptcha);
              reject(new Error('Timeout esperando reCAPTCHA'));
            }, 10000);
          }
        });
      }
}
