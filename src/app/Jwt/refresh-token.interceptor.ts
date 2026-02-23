import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, finalize, filter, take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../Services/users/authentication.service';
import { GlobalService } from '../Services/shared/global.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  public token: string = '';
  public fingerprint!: string;
  private refreshTokenCalled = false;
  private refreshTokenInProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authenticationService: AuthenticationService, private sharedService: GlobalService) {
    const user = JSON.parse(sessionStorage.getItem('userActual')!);
    let fingerprint = sessionStorage.getItem('fingerprint')!;
    if (user) {
      this.token = user.token;
      this.fingerprint = fingerprint;
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser: any = this.token;
    if (this.token) {
      const token = this.token;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const data = JSON.parse(window.atob(base64));
      const expirationDate = new Date(data.exp * 1000);
      const currentDate = new Date();
      const timeDifference = expirationDate.getTime() - currentDate.getTime();

      if (request.method === 'POST' && !request.headers.has('X-Skip-Interceptor')) {
        if (timeDifference <= 360000) { // 6 minutos antes de que el token expire
          this.authenticationService.logout();
        } else if (timeDifference <= 540000) { // 9 minutos antes de que el token expire
          if (!this.refreshTokenCalled) {
            this.refreshTokenCalled = true;
            this.refreshTokenInProgress.next(true); // Marca el inicio de la actualización del token

            this.authenticationService.newRefreshToken().pipe(
              takeUntil(this.refreshTokenInProgress) // Cancela la suscripción si se emite un nuevo valor en refreshTokenInProgress
            ).subscribe({
              next: () => {
                this.refreshTokenCalled = false; // Restablece la bandera a false después de refrescar el token
                this.refreshTokenInProgress.next(false); // Marca el final de la actualización del token
              },
              error: (err) => {
                this.refreshTokenCalled = false; // Restablece la bandera a false en caso de error
                this.authenticationService.logout();
                this.refreshTokenInProgress.next(false); // Marca el final de la actualización del token en caso de error
              }
            });
          }
        } else {
          this.refreshTokenCalled = false; // Restablece la bandera si el tiempo es mayor a 9 minutos
        }

        /*if (timeDifference <= 360000) { // 6 minutos antes de que el token expire
          this.authenticationService.logout();
        }else if (timeDifference <= 540000) { // 9 minutos antes de que el token expire
          if (!this.refreshTokenCalled) {
            //this.refreshTokenCalled = true;
            //this.refreshTokenInProgress.next(true); // Marca el inicio de la actualización del token
  
              //console.log('refresh token');
              this.authenticationService.newRefreshToken().pipe(
                takeUntil(this.refreshTokenInProgress) // Cancela la suscripción si se emite un nuevo valor en refreshTokenInProgress
              ).subscribe({
                next: (newToken) => {
                  //console.log('refresh token verificando ', newToken);
                  this.refreshTokenCalled = false; // Restablece la bandera a false después de refrescar el token
                  this.refreshTokenInProgress.next(false); // Marca el final de la actualización del token
                  //this.authenticationService.newRefreshToken(); // Actualiza el token en el servicio de autenticación
                },
                error: (err) => {
                  this.refreshTokenCalled = false; // Restablece la bandera a false en caso de error
                  this.authenticationService.logout();
                  this.refreshTokenInProgress.next(false); // Marca el final de la actualización del token en caso de error
                }
              });
            }
  
          }else {
            this.refreshTokenCalled = false; // Restablece la bandera si el tiempo es mayor a 9 minutos
          }*/
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authenticationService.logout();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        // this.sharedService.showLoader(false);
      })
    );
  }
}
