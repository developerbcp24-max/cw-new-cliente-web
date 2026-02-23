import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { MassivePaymentsPreviousFormResult } from './Models/massive-payments-previous-form-result';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { PaymentAchSpreadsheetResult } from './Models/payment-ach/payment-ach-spreadsheet-result';
import { PaymentAchData } from './Models/payment-ach/payment-ach-data';
import { ParameterResult } from '../parameters/models/parameter-result';
import { MassPaymentFavoriteTransactions } from './Models/mass-payment-favorite-transactions';
import { MassivePaymentsSpreadsheetsDto } from './Models/massive-payments-spreadsheets-dto';
import { OperationStatusResult } from './Models/operation-status-result';
import { BatchIdDto } from '../service-payments/models/batch-id-dto';
import { AccountAchResult } from './Models/account-ach-result';
import { HttpClient } from '@angular/common/http';
import { AccountAchDto } from './Models/account-ach-dto';
import Get_Ip from '../../../assets/js/get_ip';


@Injectable({
  providedIn: 'root'
})
export class PaymentAchService {
  private _paymentBankAch: string;
  private _parameters: string;
  ipClient?: string;
  constructor(private http: HttpClient, private config: AppConfig) {
    this._paymentBankAch = this.config.getConfig('PaymentAchUrl');
    this._parameters = this.config.getConfig('ParametersServiceUrl');
  }
  getIpClient() {
    this.http.get<{ ip: string }>('/jsonip')
      .subscribe({
        next: data => {
          this.ipClient = data.ip;
        }, error: _err => this.ipClient = 'NOT_IP'
      });
  }
  async getClientIp(): Promise<string> {
    let ip = await Get_Ip.obtenerIP();
    return ip;
  }
  getPreviousSpreadsheets(): Observable<MassivePaymentsPreviousFormResult[]> {
    return this.http.post<MassivePaymentsPreviousFormResult[]>(`${this._paymentBankAch}GetPreviousForm`, '');
  }

  getSpreadsheet(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentAchSpreadsheetResult[]> {
    return this.http.post<PaymentAchSpreadsheetResult[]>(`${this._paymentBankAch}GetForm`, request);
  }

  save(request: PaymentAchData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._paymentBankAch}SavePaymentBankACH`, request);
  }

  getSpreadsheetFromFile(request: FormData): Observable<PaymentAchSpreadsheetResult[]> {

    return this.http.post<PaymentAchSpreadsheetResult[]>(`${this._paymentBankAch}LoadPayRoll`, request)//ojosos postfile
  }

  getPaymentDetail(request: BatchIdDto): Observable<PaymentAchData> {
    return this.http.post<PaymentAchData>(`${this._paymentBankAch}GetDetail`, request);
  }

  getFavorites(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentBankAch}Get`, '');
  }

  getFavoritesTransfers(): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentBankAch}GetTransfers`, '');
  }

  getFavoriteDetail(request: MassivePaymentsSpreadsheetsDto): Observable<PaymentAchData> {
    return this.http.post<PaymentAchData>(`${this._paymentBankAch}GetFavoriteTransaction`, request);
  }

  deleteFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<OperationStatusResult> {
    return this.http.post<OperationStatusResult>(`${this._paymentBankAch}Remove`, request);
  }

  updateFavorite(request: MassivePaymentsSpreadsheetsDto): Observable<MassPaymentFavoriteTransactions[]> {
    return this.http.post<MassPaymentFavoriteTransactions[]>(`${this._paymentBankAch}Update`, request);
  }

  getBanks(): Observable<ParameterResult[]> {
    return this.http.post<ParameterResult[]>(`${this._parameters}GetBanksACH`, '');
  }

  getBanksOdd(): Observable<ParameterResult[]> {
    return this.http.post<ParameterResult[]>(`${this._parameters}GetBanksOdd`, '');
  }

  getBranchOffices(): Observable<ParameterResult> {
    return this.http.post<ParameterResult>(`${this._paymentBankAch}GetBranchOffices`, '');
  }

  verifyAccountACHes(request: AccountAchDto): Observable<AccountAchResult> {
    return this.http.post<AccountAchResult>(`${this._paymentBankAch}VerifyAccountACH`, request);
  }

  superviceMonitor(request: PaymentAchData): Observable<ProcessBatchResult> {
    return this.http.post<ProcessBatchResult>(`${this._paymentBankAch}SuperviseMonitor`, request);
  }
}
