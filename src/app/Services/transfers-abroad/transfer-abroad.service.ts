import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { TicketOtherCurrencyDto } from './models/ticket-other-currency-dto';
import { ParametersResult } from './models/parameters-result';
import { ConfigurationsParameter } from './models/configurations-parameter';
import { TransferAbroadDto } from './models/transfer-abroad-dto';
import { ProcessBatchResult } from '../shared/models/process-batch-result';
import { DestinationBanksDto } from './models/destination-banks-dto';
import { DestinationBankResult } from './models/destination-bank-result';
import { GetTransferAbroadDto } from './models/get-transfer-abroad-dto';
import { TransferAbroadResult } from './models/transfer-abroad-result';
import { ParameterASFIResult } from './models/parameter-asfi-result';
import { TransferAbroadDetailResult } from './models/transfer-abroad-detail-result';
import { TransferAbroadDetailDto } from './models/transfer-abroad-detail-dto';
import { TransferAbroadPreSaveDto } from './models/transfer-abroad-pre-save-dto';
import { TransferAbroadFrecuent } from './models/transfer-abroad-frecuent';
import { TransferAbroadFrecuentDto } from './models/transfer-abroad-frecuent-dto';
import { TransferAbroadSwiftDto } from './models/transfer-abroad-swift-dto';
import { TransferAbroadSwiftListResult } from './models/transfer-abroad-swift-result';
import { TransferAbroadSwiftReportDto } from './models/transfer-abroad-swift-report-dto';
import { OperationReceivedDto } from './models/operation-received-dto';
import { OperationReceivedResult } from './models/operation-received-result';
import { TransferAbroadSwiftReportReceivedDto } from './models/transfer-abroad-swift-report-received-dto';
import { GpiDatesResult } from './models/gpi-dates-result';
import { TicketOtherCurrencyResult } from './models/ticket-other-currency-result';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TransfersAbroadService {

  private transfersService: string;
  private MAX_APOM_TRANSFER = 'MAX_APOMTR';
  private MIN_APOM_TRANSFER = 'MIN_APOMTR';
  private SCHEDULE_TRANSFERENCE = 'M_HORARIO';

  constructor(private config: AppConfig, private http: HttpClient){
    this.transfersService = this.config.getConfig('TransfersAbroadServiceUrl');
  }

  getParameters(): Observable<ParametersResult> {
    const { transfersService } = this;
    return this.http.post<ParametersResult>(`${transfersService}GetParameters`, '');
  }

  getConfigurationParameters(): Observable<ConfigurationsParameter> {
    const { transfersService } = this;
    return this.http.post<ConfigurationsParameter>(`${transfersService}GetConfigurationsParameters`, '')
      .pipe(map((res: any) => {
        const result: ConfigurationsParameter = new ConfigurationsParameter();
        if (res.length > 0) {
          result.maxAmountTransfer = +res.find((x: any) => x.code === this.MAX_APOM_TRANSFER)!.value;
          result.minAmountTransfer = +res.find((x: any) => x.code === this.MIN_APOM_TRANSFER)!.value;
          result.schedules = res.find((x: any) => x.code === this.SCHEDULE_TRANSFERENCE)!.description;
          return result;
        }
        return null!;
      }));
  }

  getTicketOtherCurrency(ticket: TicketOtherCurrencyDto): Observable<TicketOtherCurrencyResult> {
    const { transfersService } = this;
    return this.http.post<TicketOtherCurrencyResult>(`${transfersService}GetTicketOtherCurrency`, ticket);
  }

  saveTransfer(transferAbroadDto: TransferAbroadDto): Observable<ProcessBatchResult> {
    const { transfersService } = this;
    return this.http.post<ProcessBatchResult>(`${transfersService}SaveTransfer`, transferAbroadDto);
  }

  preSaveTransfer(transferAbroadPreSaveDto: TransferAbroadPreSaveDto): Observable<ProcessBatchResult> {
    const { transfersService } = this;
    return this.http.post<ProcessBatchResult>(`${transfersService}PreSaveTransfer`, transferAbroadPreSaveDto);
  }

  saveTransferDetail(transferAbroadDetailDto: TransferAbroadDetailDto): Observable<ProcessBatchResult> {
    const { transfersService } = this;
    return this.http.post<ProcessBatchResult>(`${transfersService}SaveTransferDetail`, transferAbroadDetailDto);
  }

  getTransferAbroad(getTransferAbroadDto: GetTransferAbroadDto): Observable<TransferAbroadResult> {
    const { transfersService } = this;
    return this.http.post<TransferAbroadResult>(`${transfersService}GetTransfer`, getTransferAbroadDto);
  }

  getTrackerGPI(getTransferAbroadDto: GetTransferAbroadDto): Observable<GpiDatesResult[]> {
    const { transfersService } = this;
    return this.http.post<GpiDatesResult[]>(`${transfersService}TrackerGPI`, getTransferAbroadDto);
  }

  getTransferAbroadDetail(getTransferAbroadDto: GetTransferAbroadDto): Observable<TransferAbroadDetailResult> {
    const { transfersService } = this;
    return this.http.post<TransferAbroadDetailResult>(`${transfersService}GetTransferDetail`, getTransferAbroadDto);
  }

  getDestinationBanks(destinationBankDto: DestinationBanksDto): Observable<DestinationBankResult[]> {
    const { transfersService } = this;
    return this.http.post<DestinationBankResult[]>(`${transfersService}GetGestinationBanks`, destinationBankDto);
  }

  getParametersASFI(): Observable<ParameterASFIResult[]> {
    const { transfersService } = this;
    return this.http.post<ParameterASFIResult[]>(`${transfersService}GetParametersASFI`, {});
  }

  isAvailable(): Observable<boolean> {
    const { transfersService } = this;
    return this.http.post<boolean>(`${transfersService}isAvailable`, {});
  }

  getTransferFrecuents(): Observable<TransferAbroadFrecuent[]> {
    const { transfersService } = this;
    return this.http.post<TransferAbroadFrecuent[]>(`${transfersService}GetTransfersFrecuent`, {});
  }
  getFormTransAbroad(): Observable<TransferAbroadFrecuent[]> {
    const { transfersService } = this;
    return this.http.post<TransferAbroadFrecuent[]>(`${transfersService}GetFormTransAbroad`, {});
  }

  removeFrecuentTransfer(transferAbroadFrecuentDto: TransferAbroadFrecuentDto): Observable<ProcessBatchResult> {
    const { transfersService } = this;
    return this.http.post<ProcessBatchResult>(`${transfersService}RemoveFrecuentTransferAbroad`, transferAbroadFrecuentDto);
  }

  getTransfersSwift(transferAbroadSwiftDto: TransferAbroadSwiftDto): Observable<TransferAbroadSwiftListResult> {
    const { transfersService } = this;
    return this.http.post<TransferAbroadSwiftListResult>(`${transfersService}GetTransfersAbroadSwift`, transferAbroadSwiftDto);
  }

  getReportSender(transferAbroadSwiftReportSenderDto: TransferAbroadSwiftReportDto): Observable<Blob> {
    const { transfersService } = this;
    return this.http.post(`${transfersService}GetReportSender`, transferAbroadSwiftReportSenderDto, { responseType: 'blob' });//ojosos postReport
  }

  getOperationsReceived(operationReceivedDto: OperationReceivedDto): Observable<OperationReceivedResult[]> {
    const { transfersService } = this;
    return this.http.post<OperationReceivedResult[]>(`${transfersService}GetOperationsReceivedSwift`, operationReceivedDto);
  }

  getReportReceived(transferAbroadSwiftReportReceivedDto: TransferAbroadSwiftReportReceivedDto): Observable<Blob> {
    const { transfersService } = this;
    return this.http.post(`${transfersService}GetReportReceived`, transferAbroadSwiftReportReceivedDto, { responseType: 'blob' });//ojosos postReport
  }
}
