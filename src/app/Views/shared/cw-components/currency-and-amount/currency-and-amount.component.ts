import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { CurrencyAndAmount } from '../../../../Services/transfers/models/currency-and-amount';
import { TicketComponent } from '../ticket/ticket.component';
import { ProcessBatchDto } from '../../../../Services/shared/models/process-batch';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { CashOnline } from '../../../../Services/accounts/models/CashOnline';
/* import { CashOnline } from 'src/app/Services/accounts/models/CashOnline';
import { ParameterResult } from 'src/app/Services/parameters/models/parameter-result'; */

@Component({
  selector: 'app-currency-and-amount',
  standalone: false,
  templateUrl: './currency-and-amount.component.html',
  styleUrls: ['./currency-and-amount.component.css'],
  providers: [ParametersService, UtilsService]
})
export class CurrencyAndAmountComponent implements OnInit, OnChanges {

  isShowOriginAndDestinationFundsForm = false;
  minimumAmountUIF!: number;
  data: CurrencyAndAmount = new CurrencyAndAmount();
  @Input() currencies: ParameterResult [] = [];
  //@Input() currencies = Constants.currencies;
  showCompanyLimits = false;
  @Input() batchInformation!: ProcessBatchDto | any;
  @Input() isMassivePayment = false;
  @Input() showCompanyLimitsLink = true;
  @Input() preferentialExchangeTicket = true;
  @Input() isAmountDisabled!: boolean;
  @Input() alwaysShowFundDeclarationForm = false;
  @Input() disabledAfterSave = false;
  @Input() isFlagVisible = false;
  @Input() disabled = false;
  @Input() isCurrencyBlocked = false;
  @Input() verifyFundDeclarationAmount = true;
  @Input() maximumDigitsAllowed: number;
  @Input() amount!: number;
  @Input() currency!: string;
  @Input() sourceCurrency!: string;
  @Input() amountTag: string;
  @Input() currencyTag: string;
  @Output() onChange: EventEmitter<CurrencyAndAmount>;
  @Output() onChangeCurreny: EventEmitter<boolean> = new EventEmitter();
  @Output() isShowFundsForm = new EventEmitter<boolean>();
  @Input() isVisibleFunds = true;
  @Input() groupIndex: any = undefined;
  @Input() sameCurrency = false;
  @Input() isCashOnlineNew: CashOnline = new CashOnline();
  @ViewChild(TicketComponent) ticketComponent!: TicketComponent;
  @ViewChild('currencyAndAmountForm') form!: NgForm;
  @ViewChild('fundDiv') foundsForm!: ElementRef;
  isValidateDest = false;
  currenDesc: any;

  constructor(private paramService: ParametersService, private utilsService: UtilsService,
              private globalService: GlobalService, private parametersService: ParametersService, private cdRef: ChangeDetectorRef) {
    this.onChange = new EventEmitter();
    this.amountTag = 'Ingresa el monto';
    this.currencyTag = 'Moneda';
    this.maximumDigitsAllowed = 25;
  }

  ngOnInit() {
    this.amount = 0.00;
    if (!this.utilsService.isUif()) {
      this.getMinimumAmountUIF();
      if (this.isCurrencyBlocked) {
        this.data.currency = Constants.currencyBol;
      }
    }
    this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TICKET', code: 'MDD' }))
      .subscribe({next: response => this.isValidateDest = response.value == 'A'});
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    this.currenDesc = this.currencies.length > 0 ? this.currencies[0] : '';
    if (!this.utilsService.isUif()) {
      if (this.utilsService.showOriginDestinationFunds()) {
        this.handleShowFunds();
        return;
      }
      setTimeout(() => {
        if ((changes.amount !== undefined && !changes.amount.isFirstChange()) || (changes.currency !== undefined && !changes.currency.isFirstChange())) {
          this.data.amount = this.amount;
          if (this.currency !== undefined) {
            this.data.currency = this.currency;
          }
          this.showOriginAndDestinationFundsForm();
        }
      });
    }
  }

  handleExampleExternalLink() {
    const href = 'https://www.bcp.com.bo/Empresas/OrigenDestinoFondos';
    window.open(href);
  }

  handleChangeCurrency(){
    if (this.groupIndex == 0 || this.groupIndex == 2) {
      if (this.isValidateDest) {
        this.batchInformation.destinationAccount = this.batchInformation.destinationAccount.replaceAll('-','');
        if (!this.batchInformation.destinationAccount.includes('-')) {
          let acc = this.batchInformation.destinationAccount.substring(this.batchInformation.destinationAccount.length - 3);
          let newAcc = acc.charAt(0);
          let newCurrency = newAcc == '3' ? 'BOL' : 'USD';
          if (this.batchInformation.currency == 'BOL' && this.batchInformation.sourceCurrency == 'BOL' && newCurrency == 'USD') {
            this.globalService.warning("Información", "Por favor debe seleccionar una cuenta destino en BOLIVIANOS.");
          }
        }
      }
    }
  }

  handleAmountOrCurrencyChanged() {
    if (!this.utilsService.isUif()) {
      if (this.utilsService.showOriginDestinationFunds()) {
        this.handleShowFunds();
        return;
      }
      this.showOriginAndDestinationFundsForm();
      this.onChange.emit(this.data);
    }
  }

  getMinimumAmountUIF() {
    this.paramService.getByGroupAndCode(new ParameterDto({ group: 'PRE', code: 'MONTO' }))
      .subscribe({next: response => this.minimumAmountUIF = +response.value});
  }

  handleShowFunds() {
    if (this.utilsService.showOriginDestinationFunds()) {
      this.isShowOriginAndDestinationFundsForm = true;
      this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
      return;
    }
  }

  showOriginAndDestinationFundsForm() {
    if (!this.utilsService.isUif()) {
      if (this.data.currency === undefined) {
        return;
      }
      this.isShowOriginAndDestinationFundsForm = (this.data.currency === Constants.currencyBol ?
        this.utilsService.changeAmountBolToUsd(this.data.amount) : this.data.amount) > this.minimumAmountUIF;
      this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    }
  }

  validateUif() {
    this.isShowOriginAndDestinationFundsForm = true;
    this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    this.foundsForm.nativeElement.focus();
  }

  validateFormCurrency() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.data.amount === 0) {
      return false;
    } if (this.ticketComponent !== undefined) {
      return this.form?.valid && this.ticketComponent.handleValidate();
    } else {
      return this.form?.valid;
    }
  }

  handleValidateFuds() {
    if (this.batchInformation.fundSource !== undefined) {
      this.batchInformation.fundSource = this.batchInformation.fundSource.trim() === '' ? undefined! : this.batchInformation.fundSource.trim();
    }
    if (this.batchInformation.fundDestination !== undefined) {
      this.batchInformation.fundDestination = this.batchInformation.fundDestination.trim() === '' ? undefined! : this.batchInformation.fundDestination.trim();
    }
    if (this.batchInformation.fundSource !== undefined) {
      this.batchInformation.fundSource = this.batchInformation.fundSource.length >= 15 ? this.batchInformation.fundSource : undefined!;
    }
    if (this.batchInformation.fundDestination !== undefined) {
      this.batchInformation.fundDestination = this.batchInformation.fundDestination.length >= 15 ? this.batchInformation.fundDestination : undefined!;
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    this.handleValidateFuds();
    if (!this.utilsService.isUif()) {
      if (!this.form?.valid && this.isShowOriginAndDestinationFundsForm) {
        this.foundsForm.nativeElement.focus();
      }
      if (this.batchInformation.fundSource !== undefined && this.batchInformation.fundDestination !== undefined) {
        return this.validateFormCurrency();
      } else {
        this.foundsForm.nativeElement.focus();
        this.globalService.info('Nota: ', ' El Origen y Destino de fondos debe contener mínimo 15 caracteres.');
        return false;
      }
    } else {
      if (this.isShowOriginAndDestinationFundsForm && this.form?.valid) {
        if (this.batchInformation.fundSource !== undefined && this.batchInformation.fundDestination !== undefined) {
          return this.validateFormCurrency();
        } else {
          this.globalService.info('Nota: ', ' El Origen y Destino de fondos debe contener mínimo 15 caracteres.');
          this.foundsForm.nativeElement.focus();
          return false;
        }
      } else {
        return this.validateFormCurrency();
      }
    }
  }
}
