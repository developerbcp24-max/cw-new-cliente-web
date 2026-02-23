import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { InformationMovementDepositResponseModel } from './models/information-movement-deposit-response-model';
import { MovementDepositBasicRequestModel } from './models/movement-deposit-basic-request-model';
import { ConfirmationTicket } from './models/confirmation-ticket';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MovementsDepositsService {

  private movementsAndDepositsUrl: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this.movementsAndDepositsUrl = this.config.getConfig('MovementsAndDepositsUrl');
  }

 getMovements(informationMovementDepositResponseModel: InformationMovementDepositResponseModel): Observable<any> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post(`${movementsAndDepositsUrl}GetMovementDeposit`, informationMovementDepositResponseModel);
  }
  getTotalMovement(informationMovementDepositResponseModel: InformationMovementDepositResponseModel): Observable<any> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post(`${movementsAndDepositsUrl}GetTotalMovements`, informationMovementDepositResponseModel);
  }
  getFormattedAccounts(informationMovementDepositResponseModel: InformationMovementDepositResponseModel): Observable<any> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post(`${movementsAndDepositsUrl}GetFormattedAccounts`, informationMovementDepositResponseModel);
  }
  getReportMovements(dto: InformationMovementDepositResponseModel): Observable<Blob> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post(`${movementsAndDepositsUrl}GetReport`, dto, { responseType: 'blob' });//ojosos postreport
  }

  getReportsMovements(dtos: MovementDepositBasicRequestModel): Observable<Blob> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post(`${movementsAndDepositsUrl}GetReporte`, dtos, { responseType: 'blob' });// ojosos postReport
  }

  getConfirmationTicket(): Observable<ConfirmationTicket> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post<ConfirmationTicket>(`${movementsAndDepositsUrl}GetConfirmationTickets`, '');
  }
  saveContractConfirmation(): Observable<ConfirmationTicket> {
    const { movementsAndDepositsUrl } = this;
    return this.http.post<ConfirmationTicket>(`${movementsAndDepositsUrl}SaveConfirmationTicket`, '');
  }
}
