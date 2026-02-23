import { Injectable } from '@angular/core';
import { GetDebtRequest } from './models/get-debt-request';
import { AppConfig } from '../../app.config';
import { ServiceTypes } from '../shared/enums/service-types';
import { ServicePayment } from './models/service-payment';
import { GetFavorites } from './models/get-favorites';
import { FavoritePayment } from '../shared/models/favorite-payment';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { Constants } from '../shared/enums/constants';
import { BatchIdDto } from './models/batch-id-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuatPayment } from '../ruat/models/ruat-payment';

@Injectable({
  providedIn: 'root'
})
export class ServicePaymentsService {

  private servicePaymentService: string;
  private ruatServicePayment: string;
  private afpUrl: string;
  private constants: Constants = new Constants();

  constructor(private config: AppConfig, private http: HttpClient){
    this.servicePaymentService = this.config.getConfig('ServicePaymentsServiceUrl');
    this.ruatServicePayment = this.config.getConfig('RuatServiceUrl');
    this.afpUrl = this.config.getConfig('AFPUrl');
  }

  getDebts(request: GetDebtRequest): Observable<Response> {
    const { http, servicePaymentService } = this;
    return +request.service === ServiceTypes.Delapaz ?
      http.post<Response>(`${servicePaymentService}getDELAPAZDebt`, request) :
      http.post<Response>(`${servicePaymentService}getCRESAGUAPACDebt`, request);
  }

  savePayment(request: ServicePayment): Observable<ProcessBatchResult> {
    const { http, servicePaymentService } = this;
    return http.post<ProcessBatchResult>(`${servicePaymentService}savePayment`, request);
  }

  getFavorites(request: GetFavorites): Observable<FavoritePayment[]> {
    const { http, servicePaymentService } = this;
    return http.post<FavoritePayment[]>(`${servicePaymentService}getFavorites`, request);
  }

  saveRuatPayment(request: RuatPayment): Observable<ProcessBatchResult> {//ojo se habilito
    const { http, ruatServicePayment } = this;
    return request.service === Constants.ruatVehicles ?
      http.post<ProcessBatchResult>(`${ruatServicePayment}saveVehiclePayment`, request) :
      http.post<ProcessBatchResult>(`${ruatServicePayment}savePropertyPayment`, request);
  }

  getBatchDetail(dto: BatchIdDto): Observable<any> {
    const { http, servicePaymentService, ruatServicePayment, constants } = this;
    let address: any;
    switch (dto.service) {
      case constants.creService:
      case constants.saguapacService:
        address = `${servicePaymentService}getCresaguapacDetail`;
        break;
      case constants.delapazService:
        address = `${servicePaymentService}getDelapazDetail`;
        break;
      case constants.fixedTelephonyService:
      case constants.mobileTelephonyService:
        address = `${servicePaymentService}getTelephonyDetail`;
        break;
      case constants.vehicleRuatService:
        address = `${ruatServicePayment}getVehicleDetail`;
        break;
      case constants.propertyRuatService:
        address = `${ruatServicePayment}getPropertyDetail`;
        break;
    }
    return http.post(address, dto);
  }
}
