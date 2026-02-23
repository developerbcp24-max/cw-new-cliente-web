import { Component, OnInit, Input, forwardRef, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { BallotOfWarrantyDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import { BallotOfWarrantyService } from '../../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import { NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { AccountTypes } from '../../../../Services/shared/enums/account-types';
import { Roles } from '../../../../Services/shared/enums/roles';
import { ParametersResult } from '../../../../Services/ballot-of-warranty/models/parameters-result';
import { DateRangeModel, OptionsDateRange } from '../../../shared/cw-components/date-range/date-range.component';
import { TimeDepositResult } from '../../../../Services/ballot-of-warranty/models/time-deposit-result';
import { BallotOfWarrantyAmortizationDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-amortization-dto';
import moment, { Moment } from 'moment';
import { RatesDto } from '../../../../Services/ballot-of-warranty/models/rates-dto';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';


@Component({
  selector: 'app-other-guarantees',
  standalone: false,
  templateUrl: './other-guarantees.component.html',
  styleUrls: ['./other-guarantees.component.css'],
  providers: [BallotOfWarrantyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtherGuaranteesComponent),
      multi: true
    }]
})
export class OtherGuaranteesComponent implements OnInit {

  @Input()
  ballot!: BallotOfWarrantyDto;
  @Input()
  otherWaranties!: ParametersResult;
  @Input()
  showRoe!: boolean;
  @Input() amount: any;
  @Output() onChangeStep3 = new EventEmitter<number>();
  @Output() onchangeOthers = new EventEmitter<BallotOfWarrantyDto>();
  nameFile: string;
  file: FormData = new FormData();
  isValid = false;
  messageError = true;
  uploadFile = true;
  nameC = 'Datos ROE';
  disabled = false;
  viewWarrant = true;
  historicalBox = '';
  optionsGrid = [2, 10, 2, 2];

  accountDto: AccountDto = new AccountDto();
  showCupRate = false;
  showFunds = false;
  percentage!: string;
  showDeposit = false;
  sizeCol = 6;
  modality!: boolean;
  placeOfDeliveries: ParameterResult[] = [];
  branchOfficesBallotOfWarranty = Constants.branchOfficesBallotOfWarranty;
  parametersResult!: ParametersResult;
  typeWarranty = [];
  @ViewChild('warrantyForm')
  form1!: NgForm;
  @ViewChild('entityNameForm')
  form2!: NgForm;
  @ViewChild('amortizationForm')
  form3!: NgForm;
  @ViewChild('dpfForm')
  form4!: NgForm;

  showAmortization = false;
  amountAmortization!: number;
  dateRange: DateRangeModel = new DateRangeModel();
  showCom = false;
  timeDepositResult: TimeDepositResult[] = [];
  longDescription!: string;
  deleteAmortization = false;
  addOrEdit = true;
  isMaxRow = false;
  amortizationDto!: BallotOfWarrantyAmortizationDto;
  mesageAmortization!: string;
  validComision = true;
  mesageCommission!: string;
  isEditable = false;

  optionsDateRange: OptionsDateRange = {
    isHorizontal: true,
    isMaxDateNow: true,
    showClearDate: false
  };
  FlagWarrant: ParameterDto = {
    group: "FLAGBG",
    code: "FW"
  };

  constructor(private ballotOfWarrantyService: BallotOfWarrantyService, private parameterService: ParametersService,
    private globalService: GlobalService) {
    this.nameFile = 'No se eligió ningún archivo';
  }

  ngOnInit() {
    this.parameterService.getListByGroupAndCode(this.FlagWarrant).subscribe((result: ParameterResult[]) => {
      if (result && result.length > 0) {
        this.viewWarrant = result[0].value === "1";
      }
    });
    let endDate = moment().add(1, 'months').endOf('month').format('YYYY-MM-DD');
    this.optionsDateRange.minDate = new Date();
    this.optionsDateRange.maxDate = moment(endDate).toDate();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.ballot.typeWarranty = '';
    this.accountDto = new AccountDto({
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)],
      currencies: [this.ballot.currency]
    });
    this.handleChangeAmount();
  }

  handleModal() {
    this.dateRange.dateEnd = new Date();
    if (this.ballot.amortizations.length === 0) {
      this.isMaxRow = false;
    }
    if (!this.isMaxRow) {
      if (this.ballot.amortizations.length < 8) {
        this.isMaxRow = false;
        this.amountAmortization = undefined!;
        this.addOrEdit = true;
        this.showAmortization = true;
      } else {
        this.isMaxRow = true;
        this.mesageAmortization = 'La cantidad máxima de Amortización Gradual/Progresiva es 8.';
      }
    }
  }

  handleChangePickerRange() {
    /*This is intentional*/
  }

  handleUpdateAmortization($event: any) {
    this.amortizationDto = $event;
    this.dateRange.dateEnd = $event.toThe;
    this.addOrEdit = false;
    this.showAmortization = true;

  }
  handleDeleteAmortizationModal($event: any) {
    this.amortizationDto = $event;
    this.deleteAmortization = true;
  }

  handlePushAmortization($event: any) {
    this.globalService.validateAllFormFields(this.form3.form);
    if (this.form3.valid) {
      if ($event) {
        this.ballot.amortizations.push({ toThe: this.dateRange.dateEnd!, amount: this.amountAmortization });
      } else {
        for (let item of this.ballot.amortizations) {
          if (item.toThe === this.amortizationDto.toThe && item.amount === this.amortizationDto.amount) {
            item.toThe = this.dateRange.dateEnd!;
            item.amount = this.amountAmortization;
          }
        }
      }
      this.showAmortization = false;
    }
  }

  handleDeleteAmortization() {
    for (let i = 0; i < this.ballot.amortizations.length; i++) {
      if (this.ballot.amortizations[i].toThe === this.amortizationDto.toThe && this.ballot.amortizations[i].amount === this.amortizationDto.amount) {
        this.ballot.amortizations.splice(i, 1);
      }
    }
    this.deleteAmortization = false;
  }

  handleChangeBranchOffices($event: any) {
    this.ballot.placeOfDelivery = $event.value;
    this.ballot.placeOfDeliveryDescription = $event.value;
  }

  handleChangeAmount() {
    if (this.showRoe) {
      this.nameC = 'Datos ROE';
    } else {
      this.nameC = 'Otros';
    }
  }

  handleModality($event: any) {
    this.ballot.modality = $event;
    this.isMaxRow = false;
  }

  handlRemoveFile() {
    this.nameFile = 'No se eligió ningún archivo';
    this.isValid = false;
    this.uploadFile = true;
  }

  handleAccountChanged($event: AccountResult) {
    this.ballot.sourceAccountId = $event.id;
    this.ballot.accountNumberId = $event.id;
    this.ballot.formattedAccountPDF = $event.formattedNumber;
    this.ballot.sourceAccount = $event.number;
    this.ballot.sourceCurrency = $event.currency;
  }

  handleAccountDebitChanged($event: AccountResult) {
    this.ballot.sourceAccountId = $event.id;
    this.ballot.accountDebitId = $event.id;
    this.ballot.formattedAccountDebit = $event.formattedNumber;
    this.ballot.sourceAccount = $event.number;
    this.ballot.sourceCurrency = $event.currency;
  }

  handleChangeWarranty($event: any) {
    this.ballot.typeWarranty = $event.code;
    this.ballot.typeWarrantyDescription = $event.description;
    this.showDeposit = this.showFunds = this.showCom = false;
    this.showCupRate = true;
    this.validComision = true;
    this.ballot.publicWritingDetails = [];
    this.ballot.cupRate = this.otherWaranties.ballotOfWarranty;
    /* validando comision */
    const dto = new RatesDto({ amount: this.ballot.amount, currency: this.ballot.currency, warrantyType: this.ballot.typeWarranty });
    this.ballotOfWarrantyService.getRates(dto)
      .subscribe({
        next: resp => {
          this.ballot.cupRate = resp.comission;
          this.isEditable = resp.isEditable;
          this.handleValidateComision();
        }, error: _err => console.log(_err.message)
      });
    /* fin */
  }

  handleValidateComision() {
    if (this.ballot.typeWarranty === 'LRC') {
      this.showCom = false;
      this.percentage = '%';
      this.sizeCol = 8;
      this.ballot.publicWritingDetails = this.otherWaranties.listPublicWriting;
    } else if (this.ballot.typeWarranty === 'PDF') {
      this.showFunds = true;
      this.showCom = this.ballot.showRoe ? true : false;
      this.percentage = '';
      this.sizeCol = 10;

      if (this.ballot.showRoe) {
        this.mesageCommission = 'La Comisión debe ser mayor a 0.';
        this.validComision = this.ballot.cupRate > 0 ? true : false;
      } /*else {
        this.ballot.cupRate = undefined;
      }*/
    } else if (this.ballot.typeWarranty === 'DPF') {
      this.ballotOfWarrantyService.getTimeDeposit().subscribe({
        next: resp => {
          this.timeDepositResult = resp;
          this.longDescription = this.timeDepositResult[0].code;
        }, error: _err => this.globalService.danger('Error en el servicio.', _err.message)
      });
      this.showCupRate = false;
      this.showDeposit = true;
      this.sizeCol = 6;
    }
  }

  handleInputRate($event: any) {
    this.validComision = true;
    if (Number($event) > 100) {
      this.mesageCommission = 'Debe ingresar la Tasa acordada menor/igual a 100.';
      this.validComision = false;
    }
  }

  validateForms() {
    this.globalService.validateAllFormFields(this.form1.form);
    this.globalService.validateAllFormFields(this.form2.form);
    let isValidLRC = false;
    let isValidAmortization = false;
    this.replaceNullOrEmptyStrings();
    if (this.ballot.typeWarranty === 'LRC' && this.otherWaranties.listPublicWriting.length > 0) {
      isValidLRC = true;
    } else if (this.ballot.typeWarranty === 'DPF' && this.timeDepositResult.length > 0) {
      this.globalService.validateAllFormFields(this.form4.form);
      isValidLRC = this.form4.valid!;
    } else if (this.ballot.typeWarranty === 'PDF') {
      isValidLRC = true;
    }
    if (this.ballot.typeBallotOfWarranty === 'GPR' && this.ballot.modality === 'SMO') {
      if (this.ballot.amortizations.length > 0) {
        isValidAmortization = true;
      } else {
        this.isMaxRow = true;
        this.mesageAmortization = 'Debe agregar amortización gradual/progresiva.';
      }
    } else {
      isValidAmortization = true;
    }
    if (!this.ballot.typeBallot && this.ballot.isMAU === undefined) {
      this.isMaxRow = true;
      this.mesageAmortization = 'Debe seleccionar un tipo de amortización';
    }
    this.ballot.secondTitular = this.ballot.secondTitular === undefined || this.ballot.secondTitular.trim() === '' ? '' : this.ballot.secondTitular;
    this.ballot.secondDocumentCI = this.ballot.secondDocumentCI === undefined || this.ballot.secondDocumentCI.trim() === '' ? '' : this.ballot.secondDocumentCI;
    this.ballot.thirdTitular = this.ballot.thirdTitular === undefined || this.ballot.thirdTitular.trim() === '' ? '' : this.ballot.thirdTitular;
    this.ballot.thirdDocumentCI = this.ballot.thirdDocumentCI === undefined || this.ballot.thirdDocumentCI.trim() === '' ? '' : this.ballot.thirdDocumentCI;
    if (this.form1.valid && this.form2.valid && isValidLRC && isValidAmortization && this.validComision) {
      this.onchangeOthers.emit(this.ballot);
      this.onChangeStep3.emit(3);
    }
  }
  replaceNullOrEmptyStrings() {
    for (const key in this.ballot) {
      if (typeof (this.ballot as any)[key] === 'string') {
        if ((this.ballot as any)[key] == null || (this.ballot as any)[key].trim() === '') {
          (this.ballot as any)[key] = '--';
        }
      }
    }
  }

  handleTimeDepositChange(_$event: any) {
    //no more
  }

  writeValue(obj: any): void {
    if (obj) {
      this.ballot = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void {
    //no more
  }

  propagateChange = (_: any) => {
    //no more
  };

}
