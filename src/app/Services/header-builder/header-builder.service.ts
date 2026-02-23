import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderBuilderService {
  constructor(private config: AppConfig) {}
  buildAuthHeaders(): HttpHeaders {
    const obUser = this.config.getConfig('OBUser');
    const obPassword = this.config.getConfig('OBPassword');
    const appUserId = this.config.getConfig('OBAppUserId');
    const publicToken = this.config.getConfig('OBPublicToken');
    const channel = this.config.getConfig('OBChannel');
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${obUser}:${obPassword}`)
    });
    if (appUserId) headers = headers.set('AppUserId', appUserId);
    if (publicToken) headers = headers.set('PublicToken', publicToken);
    if (channel) headers = headers.set('Channel', channel);
    return headers;
  }
}
