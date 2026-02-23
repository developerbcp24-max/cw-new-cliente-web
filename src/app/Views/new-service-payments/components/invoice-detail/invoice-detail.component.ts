import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GetServicesResult } from '../../../../Services/new-pase/models/get-services-result';
import { NewPaseDto } from '../../../../Services/new-pase/models/new-pase-dto ';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { SendBillDataComponent } from '../send-bill-data/send-bill-data.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: false,
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
  providers: [ParametersService, UtilsService, ParametersService]
})
export class InvoiceDetailComponent implements OnInit {
  constants: Constants;

  @Input() showAmount = true;
  @Input() showInvoiceData = true;
  @Input() showInvoiceDetail = true;
  @Input() newPaseDto: NewPaseDto = new NewPaseDto();
  @Input() amountDebts = 0;
  @Input() configResult: any;
  @Input() disabled!: boolean;
  @Input() getServicesResult: GetServicesResult[] = [];
  @ViewChild('billingForm') formBilling!: NgForm;

  branchOfficeCode = '201';
  centralOffice = 'OFICINA CENTRAL';
  country!: string;
  direction!: string;
  branchOffice: Constants = new Constants();
  resultParameters: ParameterResult = new ParameterResult();
  parametersDto: ParameterDto = new ParameterDto();
  @ViewChild('sendBill')dataBilling!: SendBillDataComponent;
  @Output() onChangeBill: EventEmitter<NewPaseDto>;

  docType!: ParameterResult[];
  docExtension!: ParameterResult[];

  constructor(private parametersService: ParametersService, private globalService: GlobalService, private utilsService: UtilsService,) {
    this.onChangeBill = new EventEmitter();
    this.constants = new Constants();
  }

  ngOnInit() {
    this.newPaseDto.amount = 0;
    this.getInvoceAmouny();
    this.handleBrachOffice();
    this.docType = this.utilsService.getDocmentType();
    this.docExtension = this.utilsService.getDocumentExtension();

  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.newPaseDto.newPasePayments.length > 0) {
      if (this.newPaseDto.newPasePayments[0].billingType == '1' || this.newPaseDto.newPasePayments[0].billingType == '3' || this.newPaseDto.newPasePayments[0].billingType == '5') {
        this.newPaseDto.documentType = this.constants.docmentType[0].value;
        this.newPaseDto.documentExtension = this.newPaseDto.documentType == '02' ? this.constants.documentExtensionsMasivePayments[0].value : '';
      }
    }
  }

  handleChangeChecked($event: any) {
    this.newPaseDto.isComission = $event;
    if (this.newPaseDto.isComission) {
      this.newPaseDto.streetOrAvenue = undefined!;
    }
    this.dataBilling.cleanForm();
  }

  handleBrachOffice() {
    this.country = this.branchOffice.branchOffices.find(x => x.value === this.branchOfficeCode)!.name;
    this.direction = this.branchOffice.branchOfficesDirection.find(x => x.value === this.branchOfficeCode)!.name;
    this.newPaseDto.departament = this.country;
    this.newPaseDto.streetOrAvenue = this.direction;

  }

  getInvoceAmouny() {
    this.parametersDto.group = 'INVCOS';
    this.parametersDto.code = 'COST';
    this.parametersService.getByGroupAndCode(this.parametersDto)
      .subscribe({next: resp => {
        this.resultParameters = resp;
      }});
  }

  handleShowAdditionForm(): void {
    this.newPaseDto.documentType = '';
    this.newPaseDto.documentExtension = ''
    if (this.newPaseDto.newPasePayments[0].billingType == '1' || this.newPaseDto.newPasePayments[0].billingType == '3' || this.newPaseDto.newPasePayments[0].billingType == '5') {
      this.docType[0].value = '02';
      this.newPaseDto.documentType = this.docType[0].value;
      this.newPaseDto.documentExtension = 'LA PAZ'
    }
  }

  handleValidateForm() {
    if (this.newPaseDto.newPasePayments[0].billingType == '1' || this.newPaseDto.newPasePayments[0].billingType == '3' || this.newPaseDto.newPasePayments[0].billingType == '4' || this.newPaseDto.newPasePayments[0].billingType == '5') {
      if (this.formBilling == undefined) {
        return true;
      }
      this.globalService.validateAllFormFields(this.formBilling.form);
      if (this.formBilling.valid) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  }

  selectDocType() {
    if (this.newPaseDto.documentType !== '02') {
      this.newPaseDto.documentExtension = '';
    } else {
      this.newPaseDto.documentExtension = this.docExtension[0].value;
    }
  }

  selectExtension() {
    /*This is intentional*/
  }



}
