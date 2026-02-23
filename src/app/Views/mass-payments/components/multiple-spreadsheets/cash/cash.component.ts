import { Component, OnInit, OnChanges, EventEmitter, ViewChild, Output, Input, AfterViewChecked, HostListener } from '@angular/core';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { MultiplePaymentSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/multiple-payments/multiple-payment-spreadsheets-result';
import { MultiplePaymentsData } from '../../../../../Services/mass-payments/Models/multiple-payments/multiple-payments-data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { Operation } from '../../../../../Services/mass-payments/Models/operation';
import { ErrorDetailResult } from '../../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-cash',
  standalone: false,
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
  providers: [ParametersService, UtilsService]
})
export class CashComponent implements OnInit, OnChanges, AfterViewChecked {

  headers = {
    line: true,
    amount: true,
    name: true,
    firstLastName: true,
    secondLastName: true,
    documentType: true,
    documentNumber: true,
    documentExtension: true,
    instruccionsPayment: true,
    branchOfficeDescription: true,
    details: true,
    mail: true,
  };
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  documentTypes!: ParameterResult[];
  documentType: ParameterResult = new ParameterResult;
  branchOffices!: ParameterResult[];
  documentExtension: ParameterResult = new ParameterResult;
  documentExtensions!: ParameterResult[];
  branchOffice: ParameterResult = new ParameterResult();
  detail: MultiplePaymentSpreadsheetsResult = new MultiplePaymentSpreadsheetsResult();
  @Input() spreadsheetPerPage!: MultiplePaymentSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: MultiplePaymentsData;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];

  @ViewChild('insideButton') insideButton: any;
  @ViewChild('insideElement') insideElement: any;
  showFilter= false;
  clickedInside!: boolean;
  clickedInsideBtn!: boolean;
  @HostListener('document:click', ['$event.target'])
  clickout(event: any) {
    if (this.showFilter) {
      this.clickedInside = this.insideElement.nativeElement.contains(event);
      this.clickedInsideBtn = this.insideButton.nativeElement.contains(event);
      if (!this.clickedInside && !this.clickedInsideBtn && this.showFilter) {
        this.showFilter = false;
      }
    }
  }

  constructor(private globalService: GlobalService, private parametersService: ParametersService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.branchOffices = this.utilsService.getBranchOffices();
    this.documentTypes = this.utilsService.getDocumentTypes();
    this.documentExtensions = this.utilsService.getDocumentExtension();
  }

  ngOnChanges(): void {
    this.countErrors();
    this.changeLines();
    $('tr').tooltip();
  }

  ngAfterViewChecked(): void {
    $('tr').tooltip();
  }

  countErrors() {
    this.totalErrors = this.batchInformation.spreadsheet.formCashPayments.filter(x => x.isError).length;
    this.totalCorrects = this.batchInformation.spreadsheet.formCashPayments.filter(x => !x.isError).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.formCashPayments.filter(x => x.isError));
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new MultiplePaymentSpreadsheetsResult();
    this.branchOffice = this.branchOffices[0];
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.detail.documentType === 'C.I' ? this.documentExtensions[0].code : '';
    this.detail.mail = '';
    this.selectBranchOffice();
  }

  selectBranchOffice() {
    this.detail.branchOfficeId = +this.branchOffice.code;
    this.detail.branchOfficeDescription = this.branchOffice.description;
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.formCashPayments.length; i++) {
      this.batchInformation.spreadsheet.formCashPayments[i].line = i + 1;
    }
  }

  handleShowEditForm($event: MultiplePaymentSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.branchOffice = this.branchOffices.find(x => x.description === this.detail.branchOfficeDescription)!;
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
  }

  handleRemove() {
    this.batchInformation.spreadsheet.formCashPayments.splice(this.selectedRowIndex, 1);
    this.showRemoveRowForm = false;
    this.changeLines();
    this.onRowChange.emit();
  }

  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.executeOperation();
      this.batchInformation.spreadsheet.formCashPayments.forEach(x => x.paymentType = 'EFE');
      this.showDetailForm = false;
      this.onRowChange.emit();
    }
  }

  selectDocType() {
    if (this.detail.documentType !== 'C.I.') {
      this.detail.documentExtension = '';
    } else {
      this.detail.documentExtension = this.documentExtensions[0].code;
    }
  }

  handleCancel(): void {
    this.showDetailForm = false;
    this.setNewRow();
  }

  executeOperation(): void {
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.batchInformation.spreadsheet.formCashPayments.length + 1;
        this.batchInformation.spreadsheet.formCashPayments.push(this.detail);
        break;
      case Operation.update:
        this.detail.isError = false;
        this.batchInformation.spreadsheet.formCashPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }
}

