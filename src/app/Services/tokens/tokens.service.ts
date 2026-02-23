import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { TokenResponse } from './models/token-response';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  private tokenService: string;

  constructor(private config: AppConfig, private http:  HttpClient) {
    this.tokenService = this.config.getConfig('TokensServiceUrl');
  }

  getCompanyTokens(): Observable<TokenResponse[]> {
    const { http, tokenService } = this;
    return http.post<TokenResponse[]>(`${tokenService}GetCompanyTokens`, '');
  }

  getUserTokens(): Observable<TokenResponse[]> {
    const { http, tokenService } = this;
    return http.post<TokenResponse[]>(`${tokenService}GetUserTokens`, '');
  }
}
