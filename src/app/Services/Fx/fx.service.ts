import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {UserService} from "../users/user.service";
import {VentaDto} from "../../Models/venta-dto";
import {Observable} from 'rxjs';
import {CompanyStatus} from "../../Models/company-status";
import {ResponseApp} from "../../Models/ResponseApp";

@Injectable({
  providedIn: 'root'
})
export class FxService {
  private _Url: string;

  constructor(private httpClient: HttpClient, private config: AppConfig, private userService: UserService) {
    this._Url = this.config.getConfig('FxServices');
  }

  public Autorizhed(request: any): Observable<Response> {
    const {httpClient, _Url} = this;
    return httpClient.post<Response>(`${_Url}Transfers/GetCompanyAutorizhed`, request);
  }

  public saveSales(request: VentaDto): Observable<Response> {
    const {httpClient, _Url} = this;
    return httpClient.post<Response>(`${_Url}Transfers/SaveTransfer`, request);
  }

  public GetTransfer(companyStatus: CompanyStatus): Observable<Response> {
    const {httpClient, _Url} = this;
    return httpClient.post<Response>(`${_Url}Transfers/GetTransfer`, companyStatus);
  }

  public GetBankers(): Observable<ResponseApp> {
    const {httpClient, _Url} = this;
    return httpClient.post<ResponseApp>(`${_Url}Transfers/GetBankers`, {});
  }

  public GetDetail(BatchId: number): Observable<ResponseApp> {
    const {httpClient, _Url} = this;
    return httpClient.post<ResponseApp>(`${_Url}Transfers/GetDetail`, {"BatchId": BatchId});
  }
}
