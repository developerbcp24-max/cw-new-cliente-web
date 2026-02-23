import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ExchangeRatesResponse } from './models/exchange-rates-response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  private _exchangeRates: string;
  constructor(private http: HttpClient, private config: AppConfig) {
    this._exchangeRates = this.config.getConfig('ExchangeRatesServiceUrl');
  }

  getLastOne(): Observable<ExchangeRatesResponse> {
    const { http, _exchangeRates } = this;
    return http.post<ExchangeRatesResponse>(`${_exchangeRates}GetLastOne`, '');
  }
}

