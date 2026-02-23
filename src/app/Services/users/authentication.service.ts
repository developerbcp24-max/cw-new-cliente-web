import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap, tap, throwError, catchError, map } from 'rxjs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { EncryptDecryptService } from '../encrypt-decrypt/encrypt-decrypt.service';
//import { JwtFieldEncryptionService } from '../jwt-field-encryption/jwt-field-encryption.service'; // NUEVO
import { SessionResult } from '../OTP/models/session-result';
import { CurrentUser } from './models/current-user';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DetectorDevices } from './models/DetectorDevices';
import { InactivitySessionService } from '../inactivity-session/inactivity-session.service';
import Get_Ip from '../../../assets/js/get_ip';
import { JwtFieldEncryptionService } from './jwt-field-encryption.service';

@Injectable()
export class AuthenticationService {
  public token: string;
  public ipClient: string;
  public browser: string;
  public ipPrivate!: string;
  private ipEncrypt!: string;
  private userAlias!: string;
  private userName!: string;
  private guid!: string;
  deviceInfo: DetectorDevices = new DetectorDevices();

  localIp = sessionStorage.getItem('LOCAL_IP');
  private ipRegex = new RegExp(
    /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
  );

 /*  constructor(
    private http: HttpClient,
    private router: Router,
    private config: AppConfig,
    private encrypt: EncryptDecryptService,
    private jwtFieldEncryption: JwtFieldEncryptionService, // NUEVO
    private deviceService: DeviceDetectorService,
    private inactivitySessionService: InactivitySessionService
  ) {
    const userActual = JSON.parse(sessionStorage.getItem('userActual')!);
    this.token = userActual && userActual.token;
    this.ipClient = 'NOT_IP';
    this.initializeIpClient();
    this.browser = 'NOT_BROWSER';
    this.getBrowserName();
    this.getInfoDevices();
  } */
constructor(
  private http: HttpClient,
  private router: Router,
  private config: AppConfig,
  private encrypt: EncryptDecryptService,
  private jwtFieldEncryption: JwtFieldEncryptionService,
  private deviceService: DeviceDetectorService,
  private inactivitySessionService: InactivitySessionService
) {
  try {
    const userActual = JSON.parse(sessionStorage.getItem('userActual') || 'null');
    this.token = userActual?.token || null;
  } catch (e) {
    this.token = null!;
  }

  this.ipClient = 'NOT_IP';
  this.initializeIpClient();
  this.browser = 'NOT_BROWSER';
  this.getBrowserName();
  this.getInfoDevices();
}


logout2(): Observable<any> {
  const _otp = this.config.getConfig('OTPUrl');
  const currentUser = this.getUserToken();
  let dto = new SessionResult();
  dto.guid = currentUser.guid;

  return this.http.post<Response>(_otp + 'Logout', dto, { withCredentials: true });
}

getJwtToken(): string | null {
  const decryptedToken = this.getDecryptedToken();
  if (decryptedToken) {
    this.token = decryptedToken; // Sincronizar con la propiedad
  }
  return decryptedToken;
}
  getInfoDevices() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  async initializeIpClient() {
    try {
      this.ipClient = await this.getClientIp();
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.ipClient = 'NOT_IP';
    }
  }

  async getClientIp(): Promise<string> {
    let ip = await Get_Ip.obtenerIP();
    return ip;
  }

  public getBrowserName() {
    this.browser = window.navigator.userAgent.toLowerCase();
  }
  private saveEncryptedToken(username: string, token: string, refreshToken: string, issued?: string, expires?: string, slideChecked?: boolean): void {
    const encryptedToken = this.jwtFieldEncryption.encryptSensitiveFields(token);

    const userData: any = {
      username: username,
      token: encryptedToken, // Token con campos encriptados
      refreshToken: refreshToken,
    };

    if (issued) userData.issued = issued;
    if (expires) userData.expires = expires;
    if (slideChecked !== undefined) userData.slideChecked = slideChecked;

    sessionStorage.setItem('userActual', JSON.stringify(userData));
  }
  private getDecryptedToken(): string | null {
    const userActual = JSON.parse(sessionStorage.getItem('userActual')!);
    if (!userActual || !userActual.token) {
      return null;
    }
    return this.jwtFieldEncryption.decryptSensitiveFields(userActual.token);
  }

  login(
    username: string,
    password: string,
    captcha: string,
    captchaToVerify: string,
    guid: string,
    isAlias?: boolean,
    userAlias: string = '',
    ip?: string,
    slideChecked?: boolean,
    newGuidSession?: string,
  ): Observable<boolean> {
    this.userName = username;
    this.guid = guid;
    this.ipClient = ip!;

    const isEnc = this.config.getConfig('isEncrypt');
    if (isEnc) {
      this.ipEncrypt = this.encrypt.encryptAES(this.ipClient).toString();
      this.userAlias = this.encrypt.encryptAES(userAlias).toString();
    } else {
      this.ipEncrypt = this.ipClient;
      this.userAlias = userAlias;
    }

    let _isNewJwt: boolean = this.config.getConfig('IsNewJwt');

    if (_isNewJwt) {
      return new Observable((observer) => {
        (async () => {
          try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const visitorId = result.visitorId;

            this.http
              .post<Response>(
                this.config.getConfig('NewAuthUrl') + 'oauth2/token',
                {
                  resource1: username,
                  resource2: password,
                  captchaValue: captcha,
                  captchaValueToVerify: captchaToVerify,
                  IpClient: this.ipEncrypt,
                  grant_type: 'password',
                  client_id: this.config.getConfig('ClientId'),
                  resource4: guid,
                  resource5: isAlias ? 'true' : 'false',
                  resource6: this.userAlias,
                  BrowserAgentVersion: this.deviceInfo.browser_version,
                  Browser: this.deviceInfo.browser,
                  Device: this.deviceInfo.device,
                  DeviceType: this.deviceInfo.deviceType,
                  Orientation: this.deviceInfo.orientation,
                  Os: this.deviceInfo.os,
                  Os_version: this.deviceInfo.os_version,
                  origin: window.location.href,
                  fingerprint: visitorId,
                  slideChecked: slideChecked ? 'true' : 'false',
                  newGuidSession: newGuidSession ?? '',
                },
                {
                  headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                  }),
                  withCredentials: true,
                }
              )
              .subscribe({
                next: (response: any) => {
                  try {
                    const token = response.access_token;
                    const refreshToken = response.refresh_token;
                    const issued = response.issued;
                    const expires = response.expires;
                    const slideChecked = response.slideChecked;

                    if (token && token.includes('Expired')) {
                      this.logout();
                      observer.error(new Error('Token expired'));
                      return;
                    }

                    if (token) {
                      this.token = token;

                      // GUARDAR CON CAMPOS ENCRIPTADOS
                      this.saveEncryptedToken(username, token, refreshToken, issued, expires, slideChecked);

                      sessionStorage.setItem('fingerprint', visitorId);
                      this.inactivitySessionService.startUserActivityInSessionDetection();

                      observer.next(true);
                      observer.complete();
                    } else {
                      observer.next(false);
                      observer.complete();
                    }
                  } catch (error) {
                    observer.error(error);
                  }
                },
                error: (err) => {
                  //console.error('Error during login:', err);
                  this.logout();
                  observer.error(err);
                }
              });
          } catch (error) {
            //console.error('Error initializing fingerprint:', error);
            observer.error(error);
          }
        })();
      });
    } else {
      const body = new URLSearchParams();
      body.set('resource1', username);
      body.set('resource2', password);
      body.set('captchaValue', captcha);
      body.set('captchaValueToVerify', captchaToVerify);
      body.set('IpClient', this.ipEncrypt);
      body.set('slideChecked', slideChecked ? 'true' : 'false');
      body.set('NewGuidSession', newGuidSession ?? '');
      body.set('grant_type', 'password');
      body.set('client_id', this.config.getConfig('ClientId'));
      body.set('resource4', guid);
      body.set('resource5', isAlias ? 'true' : 'false');
      body.set('resource6', this.userAlias);
      body.set('BrowserAgentVersion', this.deviceInfo.browser_version);
      body.set('Browser', this.deviceInfo.browser);
      body.set('Device', this.deviceInfo.device);
      body.set('DeviceType', this.deviceInfo.deviceType);
      body.set('Orientation', this.deviceInfo.orientation);
      body.set('Os', this.deviceInfo.os);
      body.set('Os_version', this.deviceInfo.os_version);
      body.set('origin', window.location.href);

      return this.http
        .post<Response>(
          this.config.getConfig('AuthUrl') + 'oauth2/token',
          body,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
            }),
            withCredentials: true,
          }
        )
        .pipe(
          map((response: any) => {
            const token = response.access_token;
            const refreshToken = response.refresh_token;

            if (token.includes('Expired')) {
              this.logout();
              return false;
            }

            if (token) {
              this.token = token;

              // GUARDAR CON CAMPOS ENCRIPTADOS
              this.saveEncryptedToken(username, token, refreshToken);

              this.inactivitySessionService.startUserActivityInSessionDetection();

              (async () => {
                const fp = await FingerprintJS.load({});
                const result = await fp.get();
                const visitorId = result.visitorId;
                sessionStorage.setItem('fingerprint', JSON.stringify(visitorId));
              })();

              return true;
            } else {
              return false;
            }
          })
        );
    }
  }

  getUserToken(): CurrentUser {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);
    if (!user?.token) {
      throw new Error('No user token found');
    }

    // DESENCRIPTAR TOKEN PARA LEER PAYLOAD
    const decryptedToken = this.jwtFieldEncryption.decryptSensitiveFields(user.token);

    const base64Url = decryptedToken.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const data = JSON.parse(window.atob(base64));
    return data as CurrentUser;
  }

  /**
   * Obtiene el payload desencriptado directamente
   */
  getDecryptedPayload(): any {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);
    if (!user?.token) {
      return null;
    }

    return this.jwtFieldEncryption.getDecryptedPayload(user.token);
  }

  newRefreshToken(): Observable<any> {
    const userActual = JSON.parse(sessionStorage.getItem('userActual')!);

    if (!userActual || !userActual.refreshToken) {
      return of(false);
    }

    const clientId = this.config.getConfig('ClientId');
    const body = {
      refreshToken: userActual.refreshToken,
      grantType: 'refresh_token',
      clientId: clientId,
    };
    const url = this.config.getConfig('NewAuthUrl') + 'RefreshToken';

    return this.http.post<any>(url, body).pipe(
      tap((response) => {
        if (response.access_token && response.refresh_token) {
          const username = userActual.username;

          // GUARDAR NUEVO TOKEN CON CAMPOS ENCRIPTADOS
          this.saveEncryptedToken(
            username,
            response.access_token,
            response.refresh_token,
            response.issued,
            response.expires
          );
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isValidSession(): Observable<boolean> {
    const isNewJwt: boolean = this.config.getConfig('IsNewJwt');

    if (!isNewJwt) {
      return of(true);
    }

    const userActual = JSON.parse(sessionStorage.getItem('userActual') || 'null');

    if (!userActual || !userActual.refreshToken) {
      //console.error('No hay refresh token disponible.');
      return throwError(() => new Error('No hay refresh token disponible.'));
    }

    const clientId = this.config.getConfig('ClientId');
    const body = {
      refreshToken: userActual.refreshToken,
      grantType: 'refresh_token',
      clientId: clientId,
    };
    const url = this.config.getConfig('NewAuthUrl') + 'ValidateSession';

    return this.http.post<any>(url, body).pipe(
      switchMap((response) => {
        if (response.isValidSession) {
          return of(true);
        } else {
          this.logout();
          return of(false);
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<boolean> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + this.token,
      }),
    };
    const userActual = JSON.parse(sessionStorage.getItem('userActual')!);

    if (!userActual) {
      return of(false);
    }

    const body = new URLSearchParams();
    body.set('refresh_token', userActual.refreshToken);
    body.set('grant_type', 'refresh_token');
    body.set('client_id', this.config.getConfig('ClientId'));

    return this.http
      .post<Response>(
        this.config.getConfig('AuthUrl') + 'oauth2/token',
        body,
        options
      )
      .pipe(
        map((response: any) => {
          const token = response.access_token;
          const refreshToken = response.refresh_token;

          if (token) {
            this.token = token;

            // GUARDAR CON CAMPOS ENCRIPTADOS
            this.saveEncryptedToken(userActual.username, token, refreshToken);

            (async () => {
              const fp = await FingerprintJS.load({});
              const result = await fp.get();
              const visitorId = result.visitorId;
              sessionStorage.setItem('fingerprint', JSON.stringify(visitorId));
            })();

            return true;
          } else {
            return false;
          }
        })
      );
  }

  newReload(isActiveSesion: boolean) {
    const userActual = sessionStorage.getItem('userActual');

    if (userActual !== null && isActiveSesion) {
      sessionStorage.clear();
      localStorage.clear();

      if (window.caches && window.caches.keys) {
        window.caches.keys().then((cacheNames) => {
          Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)))
            .then(() => window.location.reload())
            .catch(() => window.location.reload());
        });
      } else {
        window.location.reload();
      }
    } else if (!isActiveSesion) {
      if (window.caches && window.caches.keys) {
        window.caches.keys().then((cacheNames) => {
          Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)))
            .then(() => window.location.reload())
            .catch(() => window.location.reload());
        });
      } else {
        window.location.reload();
      }
    }
  }

  logout(): void {
    const validateSession = this.config.getConfig('validateSession');
    const newJwt = this.config.getConfig('IsNewJwt');

    if (validateSession && !newJwt) {
      this.logout2().subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      });
    } else {
      this.clearSession();
    }
  }

  private clearSession(): void {
    this.token = null!;
    sessionStorage.removeItem('userActual');
    this.inactivitySessionService.stopUserActivityInSessionDetection();
    sessionStorage.clear();
    localStorage.clear();

    if (window.caches && window.caches.keys) {
      window.caches.keys().then((cacheNames) => {
        Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)))
          .then(() => this.router.navigate(['/login']))
          .catch(() => this.router.navigate(['/login']));
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

/*   logout2(): any {
    const _otp = this.config.getConfig('OTPUrl');
    const currentUser = this.getUserToken();
    let dto = new SessionResult();
    dto.guid = currentUser.guid;

    return this.http
      .post<Response>(_otp + 'Logout', dto, { withCredentials: true })
      .subscribe((response: any) => {
        sessionStorage.removeItem('userActual');
        this.inactivitySessionService.stopUserActivityInSessionDetection();
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
      });
  } */

 /*  getJwtToken(): string | null {
    // Retornar el token DESENCRIPTADO para usar en las peticiones
    return this.getDecryptedToken();
  } */
}
