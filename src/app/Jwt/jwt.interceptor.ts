import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { GlobalService } from '../Services/shared/global.service';
import { AuthenticationService } from '../Services/users/authentication.service';
import { AppConfig } from '../app.config';
import { HeaderBuilderService } from '../Services/header-builder/header-builder.service';
import { JwtFieldEncryptionService } from '../Services/users/jwt-field-encryption.service';
@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  public token: string = '';
  public fingerprint!: string;
  private refreshTokenCalled: boolean = false;
  private sessionTokenCalled: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: GlobalService,
    private config: AppConfig,
    private headerBuilder: HeaderBuilderService,
    private jwtFieldEncryption: JwtFieldEncryptionService
  ) {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);
    let fingerprint = sessionStorage.getItem('fingerprint')!;

    if (user) {
      this.token = this.jwtFieldEncryption.decryptSensitiveFields(user.token);
      this.fingerprint = fingerprint;
    }

    const url = URL.createObjectURL(new Blob([JSON.stringify({
      "token": this.token 
    }, null, 2)], { type: 'application/json' })); 
    const a = document.createElement('a');
    a.download = 'token.json'; 
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);

  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.withCredentials) {
      const headers = this.headerBuilder.buildAuthHeaders();
      request = request.clone({
        withCredentials: false,
        headers,
      });

      if (request.body && request.body['avoidLoader']) {
        delete request.body['avoidLoader'];
      } else {
        this.sharedService.showLoader(true);
      }

      return next.handle(request);
    }

    if (
      request.method === 'POST' &&
      this.IsTokenExpired() &&
      !request.headers.has('X-Skip-Interceptor')
    ) {
      return this.authenticationService.refreshToken().pipe(
        mergeMap((res) => {
          return this.intercept(request, next);
        })
      );
    }

    if (
      request.method === 'POST' &&
      !request.headers.has('X-Skip-Interceptor')
    ) {
      this.ValidTime();
      this.sharedService.showLoader(true);

      const userActual = JSON.parse(sessionStorage.getItem('userActual')!);
      const fingerprint = sessionStorage.getItem('fingerprint')!;

      if (userActual && userActual.token) {
        const decryptedToken = this.jwtFieldEncryption.decryptSensitiveFields(userActual.token);
        this.token = decryptedToken;

        if (request.body instanceof FormData) {
          request = request.clone({
            setHeaders: {
              ContentType: 'multipart/form-data',
              Authorization: `Bearer ${decryptedToken}`,
            },
          });
        } else if (request.body instanceof URLSearchParams) {
          request = request.clone({
            setHeaders: {
              ContentType: 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${decryptedToken}`,
            },
          });
        } else {
          request = request.clone({
            setHeaders: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${decryptedToken}`,
            },
          });
        }
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authenticationService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  private IsTokenExpired(): boolean {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);

    if (!user || user == null) {
      this.authenticationService.logout();
      return false;
    }

    if (!user.token) {
      return true;
    }
    const decryptedToken = this.jwtFieldEncryption.decryptSensitiveFields(user.token);
    this.token = decryptedToken;
    const base64Url = this.token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const data = JSON.parse(window.atob(base64));
    if (Date.now() / 1000 > data.exp) {
      return false;
    }
    data.exp -= 240;
    return Date.now() / 1000 > data.exp;
  }
  private ValidTime() {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);

    if (!user || !user.token) {
      this.authenticationService.logout();
      return;
    }
    const decryptedToken = this.jwtFieldEncryption.decryptSensitiveFields(user.token);
    this.token = decryptedToken;

    const base64Url = this.token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const data = JSON.parse(window.atob(base64));
    const expirationDate = new Date(data.exp * 1000);
    const currentDate = new Date();
    const timeDifference = expirationDate.getTime() - currentDate.getTime();

    if (!this.sessionTokenCalled) {
      this.sessionTokenCalled = true;
      this.authenticationService.isValidSession().subscribe({
        next: () => {
          this.sessionTokenCalled = false;
        },
        error: (err) => {
          console.error('Error en session', err);
          this.authenticationService.logout();
          this.sessionTokenCalled = false;
        },
      });
    }

    if (timeDifference <= 360000) {
      this.authenticationService.logout();
    } else if (timeDifference <= 540000) {
      if (!this.refreshTokenCalled) {
        this.refreshTokenCalled = true;
        this.authenticationService.newRefreshToken().subscribe({
          next: () => {
            this.refreshTokenCalled = false;
          },
          error: (err) => {
            console.error('Error en refreshToken', err);
            this.refreshTokenCalled = false;
            this.authenticationService.logout();
          },
        });
      }
    } else {
      this.refreshTokenCalled = false;
    }
  }
}
