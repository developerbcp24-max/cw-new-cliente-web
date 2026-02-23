import { Component, OnInit, EventEmitter, Output, Input, ViewChild, forwardRef } from '@angular/core';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';
import { BallotOfWarrantyDto } from '../../../../Services/new-ballot-of-warranty/models/ballot-of-warranty-dto';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ParametersResult } from '../../../../Services/new-ballot-of-warranty/models/parameters-result';
import { OptionsDateRange, DateRangeModel } from '../../../shared/cw-components/date-range/date-range.component';
import moment, { Moment } from 'moment';
import { NewBallotOfWarrantyService } from '../../../../Services/new-ballot-of-warranty/new-ballot-of-warranty.service';
import { BallotOfWarrantyContractRoeDto } from '../../../../Services/new-ballot-of-warranty/models/ballot-of-warranty-contract-reo-dto';

@Component({
  selector: 'app-new-bail-data',
  standalone: false,
  templateUrl: './new-bail-data.component.html',
  styleUrls: ['./new-bail-data.component.css'],
  providers: [NewBallotOfWarrantyService, UtilsService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewBailDataComponent),
      multi: true
    }]
})
export class NewBailDataComponent implements OnInit {

  file: FormData = new FormData();
  currencies = Constants.currencies;
  amount!: number;
  currencyDesc!: string;
  isTermInDays = true;
  historicalBox = '';
  totalAmount = 0;
  isValid = false;
  messageError = true;
  nameC = 'Datos ROE';

  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false
  };

  @Input()
  objectResult!: ParametersResult;
  @Input()
  ballot!: BallotOfWarrantyDto;
  @Output() onChangeStep2 = new EventEmitter<number>();
  @Output() onChangeRoe = new EventEmitter<boolean>();
  @Output() onchangeBallot = new EventEmitter<BallotOfWarrantyDto>();
  @Input() disabled = false;
  @ViewChild('amountForm')
  form1!: NgForm;
  @ViewChild('beneficiaryForm')
  form2!: NgForm;
  @ViewChild('objectForm')
  form3!: NgForm;
  @ViewChild('renovationForm')
  form4!: NgForm;
  @ViewChild('termsForm')
  form5!: NgForm;

  dateRange: DateRangeModel = new DateRangeModel();
  sizePdf!: number;
  objectList = [];

  constructor(private newBallotOfWarrantyService: NewBallotOfWarrantyService, private parametersService: ParametersService,
    private globalService: GlobalService, private utilsService: UtilsService) {
  }
  ngOnInit() {
    this.ballot.showRoe = true;
    let endDate = moment().add(20, 'years').endOf('year').format('YYYY-MM-DD');

    this.optionsDateRange.minDate = new Date();
    this.optionsDateRange.maxDate = moment(endDate).toDate();
  }

  handleChangeObject($event: any) {
    this.ballot.object = $event;
    let result = this.objectResult.listWarrantyTypes.filter(x => x.code === $event).shift();
    this.ballot.objectOtherDescription = result!.description;
  }

  changeAmountBolToUsd(amount: number): number {
    return +amount / this.ballot.saleExchangeRate;
  }

  handleAmountChanged($event: any) {
    if ($event === 'BOL' || $event === 'USD') {
      this.ballot.currency = $event;
    } else {
      this.ballot.amount = $event;
      this.totalAmount = $event;
    }
    if (this.ballot.currency !== '') {
      if ($event === 'BOL' || this.ballot.currency === 'BOL') {
        this.totalAmount = this.changeAmountBolToUsd(this.ballot.amount);
      } else if ($event === 'USD' || this.ballot.currency === 'USD') {
        this.totalAmount = this.ballot.amount;
      }
      if (this.totalAmount >= this.objectResult.amountRequiredRoe) {
        this.ballot.showRoe = false;
        this.handleRemoveFile();
      } else {
        this.ballot.showRoe = true;
      }
    }
    this.onChangeRoe.emit(this.ballot.showRoe);
    this.ballot.amount = this.ballot.amount === undefined ? 0 : this.ballot.amount;
    this.ballot.literalAmount = this.utilsService.convertToLiteral(this.ballot.amount);
    this.ballot.currencyDescription = this.currencyDesc = this.ballot.currency === Constants.currencyBol ? 'BOLIVIANOS' : 'DOLARES';
    this.ballot.literalAmount = this.ballot.currency !== '' ? this.ballot.literalAmount + ' ' + this.currencyDesc : this.ballot.literalAmount;
    this.resetTypeWarranty();
  }

  resetTypeWarranty() {
    this.ballot.typeWarranty = null!;
  }

  onDateInitChanged() {
    this.ballot.startDate = this.dateRange.dateEnd!;
  }

  handleChangePickerRange() {
    this.ballot.startDate = this.dateRange.dateInit!;
    this.ballot.expirationDate = this.dateRange.dateEnd!;
  }

  handleTypeTerm() {
    this.ballot.expirationDate = this.dateRange.dateEnd!;
    if (this.isTermInDays) {
      this.ballot.startDate = this.dateRange.dateEnd!;
      this.ballot.expirationDate = this.ballot.startDate;
    } else {
      this.ballot.termInDays = null!;
      this.handleChangePickerRange();
    }
  }

  onFileChange($event: any ): void {
    this.ballot.isRoe = true;
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    this.ballot.nameFile = inputValue.files[0].name;
    if (file.type === 'application/pdf') {
      this.messageError = true;
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (_e) => {
        this.ballot.contractRoe = new BallotOfWarrantyContractRoeDto();
        this.ballot.contractRoe.roeDocument = myReader.result!.toString();
        this.propagateChange(this.ballot);
      };
      myReader.readAsDataURL(file);
    } else {
      this.ballot.contractRoe.roeDocument = null!;
      this.messageError = false;
    }
    this.isValid = this.messageError ? true : false;
  }

  handleSubmitFile() {
    this.ballot.uploadFile = false;
    this.ballot.isValidRoe = true;
  }

  handleRemoveFile() {
    this.ballot.isRoe = false;
    this.ballot.isValidRoe = false;
    this.ballot.contractRoe = new BallotOfWarrantyContractRoeDto();
    this.ballot.nameFile = 'No se eligió ningún archivo';
    this.isValid = false;
    this.ballot.uploadFile = true;
  }

  validateForms() {
    let isValidDay = false;
    if (this.isTermInDays && this.ballot.termInDays > 0) {
      isValidDay = true;
    } else if (!this.isTermInDays) {
      if(this.ballot.expirationDate > this.ballot.startDate){
        isValidDay = true;
      }else{
        this.globalService.danger('Fecha Final no puede ser menor o igual a Fecha Inicial', '');
      }

    }
    this.globalService.validateAllFormFields(this.form1.form);
    this.globalService.validateAllFormFields(this.form2.form);
    this.globalService.validateAllFormFields(this.form3.form);
    this.globalService.validateAllFormFields(this.form4.form);
    if (this.ballot.showRoe) {
      if (!this.ballot.isRoe && this.ballot.uploadFile && !this.ballot.isValidRoe) {
        this.messageError = false;
      } else if (this.ballot.isRoe && !this.ballot.uploadFile && this.ballot.isValidRoe) {
        this.ballot.isValidRoe = true;
      }
    } else {
      this.ballot.isValidRoe = true;
      this.ballot.contractRoe = new BallotOfWarrantyContractRoeDto();
    }

    if (this.form1.valid && this.form2.valid && this.form3.valid && this.form4.valid && isValidDay && this.ballot.isValidRoe) {
      this.ballot.amountWarranty = this.ballot.amount;
      this.onchangeBallot.emit(this.ballot);
      this.onChangeStep2.emit(2);
    }
  }

  writeValue(obj: BallotOfWarrantyDto): void {
    if (obj) {
      this.ballot = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void {
    /*nonImplentation */
  }

  propagateChange = (_: any) => { /*nonImplentation */
};

}
