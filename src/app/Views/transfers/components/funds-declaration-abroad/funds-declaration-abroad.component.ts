import { Component, OnInit, ViewChild, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { NgForm } from '@angular/forms';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-funds-declaration-abroad',
  standalone: false,
  templateUrl: './funds-declaration-abroad.component.html',
  styleUrls: ['./funds-declaration-abroad.component.css'],
  providers: [ParametersService, UtilsService]
})
export class FundsDeclarationAbroadComponent implements OnInit, OnChanges {
  isShowOriginAndDestinationFundsForm = false;
  @Input() currency!: string;
  @Input() amount!: number;
  @Input() minimumAmountUIF!: number;
  @Input() fundSource!: string;
  @Output() fundSourceChange = new EventEmitter<string>();
  @Input() fundDestination!: string;
  @Output() fundDestinationChange = new EventEmitter<string>();
  @Input() disabled = false;
  @ViewChild('fundDeclarationForm') form!: NgForm;

  constructor(private paramService: ParametersService,
    private utilsService: UtilsService,
    private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges() {
    if (this.currency && this.amount && this.minimumAmountUIF) {
      this.showOriginAndDestinationFundsForm();
    }
  }

  handleExampleExternalLink() {
    const href = 'https://www.bcp.com.bo/Empresas/OrigenDestinoFondos';
    window.open(href);
  }

  showOriginAndDestinationFundsForm() {
    if (this.currency === undefined) {
      return;
    }
    this.isShowOriginAndDestinationFundsForm = (this.currency === Constants.currencyBol ?
      this.utilsService.changeAmountBolToUsd(this.amount) : this.amount) > this.minimumAmountUIF;
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }
}
