import { Injectable } from '@angular/core';
import { TicketDto } from './models/ticket-dto';
import { AppConfig } from '../../app.config';
import { TicketCommissionDto } from './models/ticket-commission-dto';
import { TicketCommissionResult } from './models/ticket-commission-result';
import { TicketValidationResult } from './models/ticket-validation-result';
import { TicketResult } from './models/ticket-result';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TicketsService {

  private ticketsService: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this.ticketsService = this.config.getConfig('TicketsServiceUrl');
  }

  getGMESATicket(request: TicketDto): Observable<TicketResult> {
    const { http, ticketsService } = this;
    return http.post<TicketResult>(`${ticketsService}GetGMESATicket`, request);
  }

  verifyGMESATicket(request: TicketDto): Observable<TicketValidationResult> {
    const { http, ticketsService } = this;
    return http.post<TicketValidationResult>(`${ticketsService}VerifyGMESATicket`, request);
  }

  getSGMDDTicket(request: TicketCommissionDto): Observable<TicketCommissionResult> {
    const { http, ticketsService } = this;
    return http.post<TicketCommissionResult>(`${ticketsService}GetSGMDDTicket`, request);
  }

  verifySGMDDTicket(request: TicketCommissionDto): Observable<Response> {
    const { http, ticketsService } = this;
    return http.post<Response>(`${ticketsService}VerifySGMDDTicket`, request);
  }
}
