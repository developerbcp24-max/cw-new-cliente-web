import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { RequestValidTvu } from './Models/RequestValidTvu';
import { ResponseValidTvu } from './Models/ResponseValidTvu';

@Injectable({
  providedIn: 'root'
})
export class NewOptTokenVuService {

  private _newOtpToken: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._newOtpToken = this.config.getConfig('NewOtpUrl');
  }

  ValidTokenVu(request: RequestValidTvu): Observable<ResponseValidTvu> {
    return this.http.post<ResponseValidTvu>(`${this._newOtpToken}ValidateUserAndToken`, request);
  }
}
