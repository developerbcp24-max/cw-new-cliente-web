import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import  Get_Ip  from '../../../assets/js/get_ip';

@Injectable({
  providedIn: 'root',
})
export class IpAddresService {
  public ipClient: string = '';
  private apiUrl = 'https://api.ipify.org?format=json';
  private apiUrl2 = 'https://api.ipify.org/?format=json';
  public deviceInfo: any;
  constructor(private http: HttpClient) {}

  getIpClient(_ip?: any): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError((_err) => {
        //console.error('Error al obtener la IP desde jsonip.com:', _err);
        return of({ ip: 'NOT_IP' });
      })
    );
  }
  public getIpAddress(): Observable<any> {
    return this.http.get(this.apiUrl2).pipe(
      catchError((_err) => {
        //console.error('Error al obtener la IP desde api.ipify.org:', _err);
        return of({ ip: 'NOT_IP' });
      })
    );
  }

  async getClientIp(): Promise<string> {
    let ip = await Get_Ip.obtenerIP();
    return ip;
  }
}
