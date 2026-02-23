import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
//import { AppConfig } from 'src/app/app.config';
import { ConsultClientRequest } from './Models/ConsultClientRequest';
import { ConsultClientResponse } from './Models/ConsultClientResponse';
import { ResponseBranchOffices } from './Models/ResponseBranchOffices';
import { GetRespPassiveLiveTestRequest } from './Models/GetRespPassiveLiveTestRequest';
import { GetRespPassiveLiveTestResponse } from './Models/GetRespPassiveLiveTestResponse';
import { GetAccountsResponse } from './Models/GetAccountsResponse';
import { GetSignaturesResponse } from './Models/GetSignaturesResponse';
import { GetValidatePassiveLiveTestRequest } from './Models/GetValidatePassiveLiveTestRequest';
import { GetValidatePassiveLiveTestResponse } from './Models/GetValidatePassiveLiveTestResponse';
import { GetAccountsRequest } from './Models/GetAccountsRequest';
import { UpdateSelectedAccountAndFirmantes } from './Models/UpdateSelectedAccountAndFirmantes';
import { CreateDigitalFileAndSendOTPRequest } from './Models/CreateDigitalFileAndSendOTPRequest';
import { ValidateOTPDigitalFileRequest } from './Models/ValidateOTPDigitalFileRequest';
import { ResponseTermsAndConditions } from './Models/ResponseTermsAndConditions';
import { AppConfig } from '../../app.config';
import { CreateDigitalFileAndSendOTPResponse } from './Models/CreateDigitalFileAndSendOTPResponse';
import { DigitalFileReSendOTPRequest } from './Models/DigitalFileReSendOTPRequest';
import { GetFirmantesRequest } from './Models/GetFirmantesRequest';
import { UpDocBase64Request } from './Models/UpDocBase64Request';
import { DocGenerationSignatureDigitalRequest } from './Models/DocGenerationSignatureDigitalRequest';
import { UpDocBase64Response } from './Models/UpDocBase64Response';

@Injectable({
providedIn: 'root'
})
export class AffiliationRegCwService {
  private _affiliationUserCw: string;
  constructor(private http: HttpClient, private config: AppConfig) {
    this._affiliationUserCw = this.config.getConfig('AffiliationUserCwUrl');
  }

  getInfoClient(dto: ConsultClientRequest): Observable<ConsultClientResponse> {
    const { http, _affiliationUserCw } = this;
    return http.post<ConsultClientResponse>(
      `${_affiliationUserCw}ConsultClient`,
      dto,
      { withCredentials: true }
    );
  }

  getBranchOffice(): Observable<ResponseBranchOffices[]> {
    const { http, _affiliationUserCw } = this;
    return http.post<ResponseBranchOffices[]>(
      `${_affiliationUserCw}GetBranchOffices`,
      {},
      { withCredentials: true }
    );
  }

  // getAccounts(dto: GetAccountsRequest): Observable<GetAccountsResponse[]> {
  //   const { http, _affiliationUserCw } = this;
  //   return this.http.post<GetAccountsResponse[]>(
  //     `${_affiliationUserCw}GetAccountBD`,
  //     dto,
  //     { withCredentials: true }
  //   );
  // }
  getAccounts(dto: GetAccountsRequest): Observable<GetAccountsResponse[]> {
    //console.log("Servicio -", dto);
  const { http, _affiliationUserCw } = this;
  return this.http.post<GetAccountsResponse[]>(
    `${_affiliationUserCw}GetAccountBD`,
    dto,
    { withCredentials: true }
  ).pipe(
    tap(respuesta => console.log(respuesta))
  );
}


  getSignatures(dto: GetFirmantesRequest): Observable<GetSignaturesResponse[]> {
    const { http, _affiliationUserCw } = this;
    return http.post<GetSignaturesResponse[]>(
      `${_affiliationUserCw}GetFirmantesBD`,
      dto,
      { withCredentials: true }
    );
  }

  getRespPassiveLiveTest(
    dto: GetRespPassiveLiveTestRequest
  ): Observable<GetRespPassiveLiveTestResponse> {
    const { http, _affiliationUserCw } = this;
    return http.post<GetRespPassiveLiveTestResponse>(
      `${_affiliationUserCw}GetRespPassiveLiveTest`,
      dto,
      { withCredentials: true }
    );
  }

  getValidatePassiveLiveTest(
    dto: GetValidatePassiveLiveTestRequest
  ): Observable<GetValidatePassiveLiveTestResponse> {
    const { http, _affiliationUserCw } = this;
    return http.post<GetValidatePassiveLiveTestResponse>(
      `${_affiliationUserCw}GetValidatePassiveLiveTest`,
      { ...dto, avoidLoader: true },
      { withCredentials: true }
    );
  }

  createDigitalFileAndSendOTP(
    dto: CreateDigitalFileAndSendOTPRequest
  ): Observable<CreateDigitalFileAndSendOTPResponse> {
    const { http, _affiliationUserCw } = this;
    return http.post<CreateDigitalFileAndSendOTPResponse>(
      `${_affiliationUserCw}CreateDigitalFileAndSendOTP`,
      dto,
      {
        withCredentials: true,
      }
    );
  }

  updateSelectedAccountAndFirmantes(
    dto: UpdateSelectedAccountAndFirmantes
  ): Observable<string> {
    const { http, _affiliationUserCw } = this;
    return http.post<string>(
      `${_affiliationUserCw}UpdateSelectedAccountAndFirmantes`,
      dto,
      { withCredentials: true }
    );
  }

  validateOTPDigitalFile(
    dto: ValidateOTPDigitalFileRequest
  ): Observable<boolean> {
    const { http, _affiliationUserCw } = this;
    return http.post<boolean>(
      `${_affiliationUserCw}ValidateOTPDigitalFile`,
      dto,
      {
        withCredentials: true,
      }
    );
  }

  digFileSignatureReSendOTP(
    dto: DigitalFileReSendOTPRequest
  ): Observable<CreateDigitalFileAndSendOTPResponse> {
    const { http, _affiliationUserCw } = this;
    return http.post<CreateDigitalFileAndSendOTPResponse>(
      `${_affiliationUserCw}DigitalFileReSendOTP`,
      dto,
      { withCredentials: true }
    );
  }

  getTermsAndConditions(): Observable<ResponseTermsAndConditions> {
    const { http, _affiliationUserCw } = this;
    return http.post<ResponseTermsAndConditions>(
      `${_affiliationUserCw}GetTermsAndConditions`,
      {},
      { withCredentials: true }
    );
  }

  upDocBase64(dto: UpDocBase64Request): Observable<UpDocBase64Response> {
    const { http, _affiliationUserCw } = this;
    return http.post<UpDocBase64Response>(`${_affiliationUserCw}UpDocBase64`, dto, {
      withCredentials: true,
    });
  }

  docGenerationSignatureDigital(
    dto: DocGenerationSignatureDigitalRequest
  ): Observable<string> {
    const { http, _affiliationUserCw } = this;
    return http.post<string>(
      `${_affiliationUserCw}DocGenerationSignatureDigital`,
      dto,
      { withCredentials: true }
    );
  }
}
