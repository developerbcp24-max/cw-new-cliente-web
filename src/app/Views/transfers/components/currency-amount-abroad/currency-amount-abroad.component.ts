import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ParameterCurrencyResult } from '../../../../Services/transfers-abroad/models/parameter-currency-result';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { TransferAbroadPreSaveDto } from '../../../../Services/transfers-abroad/models/transfer-abroad-pre-save-dto';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';

@Component({
  selector: 'app-currency-amount-abroad',
  standalone: false,
  templateUrl: './currency-amount-abroad.component.html',
  styleUrls: ['./currency-amount-abroad.component.css'],
  providers: []
})
export class CurrencyAmountAbroadComponent implements OnInit {
  @Output() isShowFundsForm = new EventEmitter<boolean>();
  constants: Constants = new Constants();
  minimumAmountUIF!: number;
  depositAmountInDollars!: number;
  exchangeRate!: number;
  showGetManadatoryTicketForm: boolean;
  currenciesTransfer: any;
  currencyFlag = '';
  @Input() transferAbroadDto: TransferAbroadPreSaveDto = new TransferAbroadPreSaveDto();
  @Input() isFlagVisible: boolean;
  @Input() disabled: boolean;
  @Input() disabledAfterSave: boolean;
  @Input() currencies: ParameterCurrencyResult[] = [];
  @Output() onChangeCurrencyDestinationIsDollar = new EventEmitter<boolean>();
  @ViewChild('currencyAmountAbroadForm')
  form!: NgForm;
  @ViewChild('fundDiv')
  foundsForm!: ElementRef;

  isShowOriginAndDestinationFundsForm = false;
  showCompanyLimits = false;

  constructor(private globalService: GlobalService, private utilsService: UtilsService, private paramService: ParametersService) {
    this.showGetManadatoryTicketForm = false;
    this.isFlagVisible = false;
    this.disabled = false;
    this.disabledAfterSave = false;
    this.currenciesTransfer = Constants.currencies.filter(x => x.value === Constants.currencyUsd);
    this.transferAbroadDto.currency = Constants.currencyUsd;
    this.transferAbroadDto.destinationCurrency = Constants.currencyUsd;
  }

  ngOnInit() {
    if (!this.utilsService.isUif()) {
      this.getMinimumAmountUIF();
    }
    this.handleShowFunds();
    this.handleCurrencyDestiny();
  }

  handleShowFunds() {
    if (this.utilsService.showOriginDestinationFunds()) {
      this.isShowOriginAndDestinationFundsForm = true;
      this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    }
  }

  handleCurrencyDestiny() {
    this.currencyFlag = this.transferAbroadDto.destinationCurrency;
    if (this.transferAbroadDto.destinationCurrency === Constants.currencyUsd) {
      this.onChangeCurrencyDestinationIsDollar.emit(true);
    } else {
      this.onChangeCurrencyDestinationIsDollar.emit(false);
    }
  }

  validateUif() {
    this.isShowOriginAndDestinationFundsForm = true;
    this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    this.foundsForm.nativeElement.focus();
  }

  handleValidateUif() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      if (this.transferAbroadDto.currency === this.transferAbroadDto.destinationCurrency) {
        if (this.transferAbroadDto.amount !== this.transferAbroadDto.destinationAmount) {
          this.globalService.danger('Advertencia'
            , 'Cuando la moneda destino es dolares, el monto a transferir debe ser igual al monto del importe destino', true);
          return false;
        }
      }
      return true;
    }
    return false;
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    if (!this.utilsService.isUif()) {
      if (!this.form.valid && this.isShowOriginAndDestinationFundsForm) {
        this.foundsForm.nativeElement.focus();
      }
      return this.handleValidateUif();
    } else {
      if (this.isShowOriginAndDestinationFundsForm && this.form.valid) {
        if (this.transferAbroadDto.fundSource !== undefined && this.transferAbroadDto.fundDestination !== undefined) {
          return this.handleValidateUif();
        }
        return false;
      }
      return this.handleValidateUif();
    }
  }

  handleExampleExternalLink() {
    const href = 'https://www.bcp.com.bo/Empresas/OrigenDestinoFondos';
    window.open(href);
  }

  showOriginAndDestinationFundsForm() {
    if (!this.utilsService.isUif()) {
      if (this.utilsService.showOriginDestinationFunds()) {
        this.handleShowFunds();
        return;
      }
      if (this.transferAbroadDto.currency === undefined) {
        return;
      }
      this.isShowOriginAndDestinationFundsForm = (this.transferAbroadDto.currency === Constants.currencyBol ?
        this.utilsService.changeAmountBolToUsd(this.transferAbroadDto.amount) : this.transferAbroadDto.amount) > this.minimumAmountUIF;
      this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
    }
  }

  getMinimumAmountUIF() {
    this.paramService.getByGroupAndCode(new ParameterDto({ group: 'PRE', code: 'MONTO' }))
      .subscribe({next: response => this.minimumAmountUIF = +response.value});
  }
}
