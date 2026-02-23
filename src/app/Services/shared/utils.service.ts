import { Injectable } from '@angular/core';
import { IMyDate } from 'mydatepicker';
import { Observable, Subject } from 'rxjs';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { Constants } from './enums/constants';
import { GlobalService } from './global.service';
import { AccountClientResult } from '../mass-payments/Models/account-client-result';
import { NumberToLiteral } from './models/numeral-to-literal';
import { ValidateConst } from '../../Directives/validate-const';
import { ErrorDetailResult } from '../mass-payments/Models/error-detail-result';
import { ProcessBatchDto } from './models/process-batch';
import { AppConfig } from '../../app.config';
import { ParameterResult } from '../parameters/models/parameter-result';
import { UifService } from '../uif/uif.service';
import { HttpClient } from '@angular/common/http';
import { UifcwResult } from '../uif/models/uifcw-result';
import { UifcwDto } from '../uif/models/uifcw-dto';
import { CurrencyFlag } from './models/currency-flag';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private currencies = 'config/currency-flags.json';
  public saleExchangeRate!: number;
  errorsDetail!: ErrorDetailResult[];
  parameterResult: ParameterResult[]= [];
  constants: Constants = new Constants();

  constructor(private exchangeRatesService: ExchangeRatesService, private messageService: GlobalService, private _http: HttpClient,
    private UIFService: UifService, private config: AppConfig) {
  }

  getToday(): IMyDate {
    const date = new Date();
    const modelDate: IMyDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    return modelDate;
  }
  getRoleQR() {
    this.parameterResult = [];
    for (const item of this.constants.roleQr){
      this.parameterResult.push({description: item.name, code: item.value, value: ''});
    }
    return this.parameterResult;
  }

  getBranchOffices() {
    this.parameterResult = [];
    for (const item of this.constants.branchOfficesNational){
      this.parameterResult.push({description: item.name, code: item.value, value: ''});
    }
    return this.parameterResult;
  }

  getDocumentTypes() {
    this.parameterResult = [];
    for (const item of this.constants.documentTypesMasivePayments){
      this.parameterResult.push({description: item.name, code: item.value, value: ''});
    }
    return this.parameterResult;
  }

  getDocumentTypesCashOnline() {
    this.parameterResult = [];
    for (const item of this.constants.documentTypesCashOnline){
      this.parameterResult.push({description: item.name, code: item.value, value: ''});
    }
    return this.parameterResult;
  }
  getExpirationTime() {
    this.parameterResult = [];
    for (const item of this.constants.expirationTime){
      this.parameterResult.push({description: item.time, code: item.value, value: ''});
    }
    return this.parameterResult;
  }

  getDocmentType() {
    this.parameterResult = [];
    for (const item of this.constants.docmentType){
      this.parameterResult.push({description: item.docTipe, code: item.value, value: ''});
    }
    return this.parameterResult;
  }

  getDocumentExtension() {
    this.parameterResult = [];
    for (const item of this.constants.documentExtensionsMasivePayments){
      this.parameterResult.push({description: item.name, code: item.value, value: ''});
    }
    return this.parameterResult;
  }

  getLastOne() {
    this.exchangeRatesService.getLastOne()
      .subscribe({next: response => {
        this.saleExchangeRate = response.purchase;
      }});
  }

  changeAmountBolToUsd(amount: number): number {
    return +amount / this.saleExchangeRate;
  }

  changeAmountUsdToBol(amount: number): number {
    return amount * this.saleExchangeRate;
  }

  validateAmount(sourceCurrency: string, sourceAmount: number, destinationCurrency: string, destinationAmount: number): boolean {
    sourceAmount = +sourceAmount;
    destinationAmount = +destinationAmount;
    if (sourceCurrency === Constants.currencyBol) {
      sourceAmount = this.changeAmountBolToUsd(sourceAmount);
    }
    if (destinationCurrency === Constants.currencyBol) {
      destinationAmount = this.changeAmountBolToUsd(destinationAmount);
    }
    return sourceAmount < destinationAmount;
  }

  getCurrencyFlags(): Observable<CurrencyFlag[]> {
    return this._http.get<CurrencyFlag[]>(this.currencies);
  }
  /*getCurrencyFlags(): Observable<CurrencyFlag[]> {
    const { _http, currencies } = this;
    return _http.get<CurrencyFlag[]>(`${currencies}`);
  }*/

  countErrorsMassivePayments($event: AccountClientResult[]) {
    let c = 0;
    for(let item of $event){
      if(!item.isOk){
        c++;
      }
    }
    if (c > 10) {
      return false;
    } else {
      return true;
    }
  }

  public donwloadReport(nameReport: string, report: Blob) {
    const extension = report.type.replace('application/', '');
    const data = window.URL.createObjectURL(report);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    if (extension.trim() === 'txt') {
      link.download = nameReport + '.' + extension.trim();
    }
    link.download = nameReport;
    link.target = '_ self';
    link.click();
  }

  public validateAmountZero($event: any) {
    const errorMessages = ValidateConst;
    const validateInteger = errorMessages.find(x => x.type === 'integer');

    let isValidAccount = true;
    let isValidTarget = true;
    let isValidAccountD = true;
    let isValidGloss = true;

    for (let item of $event.detail) {
      let accountNumber = item.accountNumber;
      let targetAccount = item.targetAccount;
      let destinationAccount = item.destinationAccount;

      if (accountNumber !== undefined || accountNumber === '') {
        isValidAccount = validateInteger!.regex.test(accountNumber);
      } else if (targetAccount !== undefined || targetAccount === '') {
        isValidTarget = validateInteger!.regex.test(targetAccount);
      } else if (destinationAccount !== undefined || destinationAccount === '') {
        isValidAccountD = validateInteger!.regex.test(destinationAccount);
      }

      isValidGloss = this.validateGloss(item);
      if (item.amount === 0 || (!isValidAccount || !isValidTarget || !isValidAccountD) || (!isValidGloss )) {
        item.isEdit = true;
      }
    }
  }

  public validateGloss(item:any){
    const errorMessages = ValidateConst;
    let gloss = item.gloss;
      let glossPayment = item.glossPayment;
    const validateGloss = errorMessages.find(x => x.type === 'alphanumericBasicSymbols');

    if (gloss !== undefined || gloss === '') {
      return validateGloss!.regex.test(gloss);
    } else if (glossPayment !== undefined || glossPayment === '') {
      return validateGloss!.regex.test(glossPayment);
    }
  }

  public validateRows($event: any) {
    if ($event.find((x: any) => x.isEdit === true)) {
      return true;
    } else {
      return false;
    }
  }

  public convertToLiteral(amount: number) {
    const asd = new NumberToLiteral();
    return asd.convertToLiteral(amount);
  }

  public sumTotal($array: any) {
    $array = this.roundAmounts($array);
    let amount = $array.reduce((x: any, y: any) => (+x) + (+y.amount), 0);
    amount = Math.round(amount * Math.pow(10, 2)) / Math.pow(10, 2);
    return amount;
  }

  public roundAmounts($array: any) {
    for (let i of $array) {
      i.amount = Math.round(i.amount * Math.pow(10, 2)) / Math.pow(10, 2);
    }
    return $array;
  }

  public addErrors(array: any) {
    this.errorsDetail = [];
    for (let item of array) {
      this.errorsDetail.push(new ErrorDetailResult({
        line: item.line,
        messageError: item.errorMessages
      }));
    }
    return this.errorsDetail;
  }

  public QueryUIF(batch: ProcessBatchDto []): Observable<UifcwResult[]> {
    const subject = new Subject<UifcwResult[]>();
    const dto = [];
    for(let item of batch) {
      let exchangeRate;
      if(item.currency === 'BOL'){
        exchangeRate =1
      }
      else{
        exchangeRate = item.isTicket ? item.preferentialExchange : this.saleExchangeRate;
      }
        dto.push(new UifcwDto({
        processBatchId: item.id,
        accountNumber: item.formattedNumber,
        amount: item.amount,
        causalTransaction: item.causalTransaction,
        currency: item.currency,
        exchangeRate: exchangeRate,
        typeTransaction: 'LAVA',
        fundSource: item.fundSource,
        fundDestination: item.fundDestination,
        description: item.description
      }));
    }
    this.UIFService.IsValidUIF(dto)
      .subscribe({next:res => {
        subject.next(res);
      }, error: _err=> {
        for(let item of batch) {
          subject.next([{
            trace: 'SIN TRACE',
            isValid: false,
            isValidEFE: false,
            isBlocked: false,
            numberQueryUIF: 0,
            cumulus: 0,
            cumulusEFE: 0,
            numberChannelUIF: '',
            operationTypeId: item.operationTypeId,
            causalTransaction: item.causalTransaction!,
            typeTransaction: 'LAVA',
            branchOffice: '201204',
            errorMessage: _err.errorMessage,
            isMultiple: item.operationTypeId == 20 || item.operationTypeId == 23 ? true : false
          }]);
        }
      }});
    return subject.asObservable();
  }

  public validateProdem(currency: string, spreadsheet: any) {
    if (this.config.getConfig('validateProdem')) {
      if (spreadsheet.filter((x: any) => (x.banksAchCode === 'BPR' || x.bankId === 'BPR')).length >= 1 && currency === 'USD') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public isUif() {
    return this.config.getConfig('isUif');
  }

  public showOriginDestinationFunds() {
    return this.config.getConfig('showOriginDestinationFunds');
  }

  public getFlagServicePase() {
    return this.config.getConfig('showServicePase');
  }
}
