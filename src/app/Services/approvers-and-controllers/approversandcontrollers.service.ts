import { Injectable } from '@angular/core';
import { ApproversDto } from './models/approvers-dto';
import { AppConfig } from '../../app.config';
import { ApproverOrControllerResult } from './models/approver-or-controller-result';
import { ApproversNumberResult } from './models/approvers-number-result';
import { ControllerNumberResult } from './models/controllers-number-result';
import { CismartAuthorizerDto } from './models/cismart-authorize-dto';
import { CismartAuthorizerResult } from './models/cismart-authorizer-result';
import { CismartApproversValidationDto } from './models/cismart-approvers-validation-dto';
import { CismartApproversValidationResult } from './models/cismart-approvers-validation-result';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApproversAndControllersService {

  private _approversAndControllers: string;

  constructor(private config: AppConfig, private http: HttpClient){
    this._approversAndControllers = this.config.getConfig('ApproversAndControllersServiceUrl');
  }

  getApprovers(request: ApproversDto): Observable<ApproverOrControllerResult[]> {
    const { _approversAndControllers } = this;
    return this.http.post<ApproverOrControllerResult[]>(`${_approversAndControllers}GetApprovers`, request);
  }

  getCismartApprovers(dto: CismartAuthorizerDto): Observable<CismartAuthorizerResult> {
    const { _approversAndControllers } = this;
    return this.http.post<CismartAuthorizerResult>(`${_approversAndControllers}GetCismartApprovers`, dto);
  }

  getAdmApprovers(request: ApproversDto): Observable<ApproverOrControllerResult[]> {
    const { _approversAndControllers } = this;
    return this.http.post<ApproverOrControllerResult[]>(`${_approversAndControllers}GetAdmApprovers`, request);
  }

  getControllers(request: ApproversDto): Observable<ApproverOrControllerResult[]> {
    const { _approversAndControllers } = this;
    return this.http.post<ApproverOrControllerResult[]>(`${_approversAndControllers}GetControllers`, request);
  }

  getAdmControllers(request: ApproversDto): Observable<ApproverOrControllerResult[]> {
    const { _approversAndControllers } = this;
    return this.http.post<ApproverOrControllerResult[]>(`${_approversAndControllers}GetAdmControllers`, request);
  }

  getApproversNumber(request: ApproversDto): Observable<ApproversNumberResult> {
    const { _approversAndControllers } = this;
    return this.http.post<ApproversNumberResult>(`${_approversAndControllers}GetApproversNumber`, request);
  }

  getControllersNumber(request: ApproversDto): Observable<ControllerNumberResult> {
    const { _approversAndControllers } = this;
    return this.http.post<ControllerNumberResult>(`${_approversAndControllers}GetControllersNumber`, request);
  }

  validateCismartApprovers(request: CismartApproversValidationDto): Observable<CismartApproversValidationResult> {
    const { _approversAndControllers } = this;
    return this.http.post<CismartApproversValidationResult>(`${_approversAndControllers}ValidateCismartApprovers`, request);
  }

  validateSignersNumber(request: CismartApproversValidationDto): Observable<CismartApproversValidationResult> {
    const { _approversAndControllers } = this;
    return this.http.post<CismartApproversValidationResult>(`${_approversAndControllers}ValidateSignersNumber`, request);
  }

}
