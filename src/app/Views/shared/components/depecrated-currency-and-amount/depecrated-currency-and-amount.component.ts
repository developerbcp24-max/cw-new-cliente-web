import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { CurrencyAndAmount } from '../../../../Services/transfers/models/currency-and-amount';

@Component({
  selector: 'app-depecrated-currency-and-amount',
  standalone: false,
  templateUrl: './depecrated-currency-and-amount.component.html',
  styleUrls: ['./depecrated-currency-and-amount.component.css'],
  providers: [ParametersService, UtilsService]
})
export class DepecratedCurrencyAndAmountComponent implements OnInit, OnChanges {

  isShowOriginAndDestinationFundsForm = false;
  minimumAmountUIF!: number;
  data: CurrencyAndAmount = new CurrencyAndAmount();
  currencies = Constants.currencies;
  @Input() isAmountDisabled!: boolean;
  @Input() alwaysShowFundDeclarationForm = false;
  @Input() disabledAfterSave = false;
  @Input() isFlagVisible = false;
  @Input() disabled = false;
  @Input() isCurrencyBlocked: boolean = false;
  @Input() verifyFundDeclarationAmount = true;
  @Input() maximumDigitsAllowed: number;
  @Input() amount!: number;
  @Input() currency!: string;
  @Input() amountTag: string;
  @Input() currencyTag: string;
  @Output() onChange: EventEmitter<CurrencyAndAmount>;
  @ViewChild('currencyAndAmountForm') form!: NgForm;

  constructor(private paramService: ParametersService, private utilsService: UtilsService, private globalService: GlobalService) {
    this.onChange = new EventEmitter();
    this.amountTag = 'Monto:';
    this.currencyTag = 'Moneda:';
    this.maximumDigitsAllowed = 25;
  }

  ngOnInit() {
    this.amount = 0.00;
    this.getMinimumAmountUIF();
    if (this.isCurrencyBlocked) {
      this.data.currency = Constants.currencyBol;
    }

  }

  ngOnChanges(changes: any): void {
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

  handleExampleExternalLink() {
    const href = 'https://www.bcp.com.bo/Empresas/OrigenDestinoFondos';
    window.open(href);
  }

  handleAmountOrCurrencyChanged() {
    this.showOriginAndDestinationFundsForm();
    this.onChange.emit(this.data);
  }

  getMinimumAmountUIF() {
    this.paramService.getByGroupAndCode(new ParameterDto({ group: 'PRE', code: 'MONTO' }))
      .subscribe({next: response => this.minimumAmountUIF = +response.value});
  }

  showOriginAndDestinationFundsForm() {
    if (this.data.currency === undefined) {
      return;
    }
    this.isShowOriginAndDestinationFundsForm = (this.data.currency === Constants.currencyBol ?
      this.utilsService.changeAmountBolToUsd(this.data.amount) : this.data.amount) > this.minimumAmountUIF;
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.data.amount === 0) {
      return false;
    }
    return this.form.valid;
  }
}
