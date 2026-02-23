import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { RuatDto } from './models/ruat-dto';
import { VehicleDebtResult } from './models/vehicle-debt-result';
import { PropertyDebtResult } from './models/property-debt-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RuatService {

  private _ruatService: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._ruatService = this.config.getConfig('RuatServiceUrl');
  }

  getVehicleDebt(dto: RuatDto): Observable<VehicleDebtResult> {
    const { http, _ruatService } = this;
    return http.post<VehicleDebtResult>(`${_ruatService}GetVehicleDebt`, dto);
  }

  getPropertyDebt(dto: RuatDto): Observable<PropertyDebtResult> {
    const { http, _ruatService } = this;
    return http.post<PropertyDebtResult>(`${_ruatService}GetPropertyDebt`, dto);
  }
}
