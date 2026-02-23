import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ReqRedirect } from './Models/ReqRedirect';
import { RespRedirect } from './Models/RespRedirect';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {

  private _redirectLegacyCwUrl: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this._redirectLegacyCwUrl = this.config.getConfig('RedirectLegacyCwUrl');
  }

  // Función existente para login vía bridge
  getRedirctAuth(dto: ReqRedirect): Observable<RespRedirect> {
    return this.http.post<RespRedirect>(
      `${this._redirectLegacyCwUrl}RetrieveJwt`,
      dto,
      { withCredentials: true }
    );
  }

  // Nueva función para validar si hay sesión activa
  isAuthenticated(): Observable<boolean> {
    const userJson = sessionStorage.getItem('userActual');
    if (!userJson) {
      return of(false); // no hay sesión
    }

    let user;
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      //console.error('Error parseando userActual:', e);
      return of(false);
    }

    const token = user.token;
    if (!token) {
      return of(false);
    }

    // Aquí podemos validar el token localmente decodificando el JWT
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const data = JSON.parse(window.atob(base64));

      const expired = (Date.now() / 1000) > data.exp;
      return of(!expired);
    } catch (e) {
      //console.error('Error decodificando token JWT:', e);
      return of(false);
    }

    // Opcional: si quieres validar con el backend, puedes hacer:
    // return this.http.get(`${this._redirectLegacyCwUrl}ValidateToken`, { withCredentials: true })
    //   .pipe(map(res => res.isValid), catchError(() => of(false)));
  }
}
