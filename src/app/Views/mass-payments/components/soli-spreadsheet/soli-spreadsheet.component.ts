import { AfterViewChecked, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { SoliPaymentData } from '../../../../Services/mass-payments/Models/soli-payments/soli-payment-data';
import { SoliPaymentsSpreadsheetsResult } from '../../../../Services/mass-payments/Models/soli-payments/soli-payments-spreadsheets-result';
import { SoliPaymentsService } from '../../../../Services/mass-payments/soli-payments.service';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
declare let $: any;

@Component({
  selector: 'app-soli-spreadsheet',
  standalone: false,
  templateUrl: './soli-spreadsheet.component.html',
  styleUrls: ['./soli-spreadsheet.component.css'],
  providers: [ParametersService, UtilsService, SoliPaymentsService]
})
export class SoliSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

  headers = {
    line: true,
    account: true,
    amount: true,
    titular: true,
    gloss: true,
    mail: true,
    detail: true,
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
  detail: SoliPaymentsSpreadsheetsResult = new SoliPaymentsSpreadsheetsResult();
  @Input() spreadsheetPerPage!: SoliPaymentsSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: SoliPaymentData;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];

  @ViewChild('insideButton') insideButton: any;
  @ViewChild('insideElement') insideElement: any;
  showFilter = false;
  clickedInside!: boolean;
  clickedInsideBtn!: boolean;

  constructor(private soliService: SoliPaymentsService, private globalService: GlobalService, private utilsService: UtilsService) { }

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

  ngOnInit() {
    this.branchOffices = this.utilsService.getBranchOffices();
    this.documentTypes = this.utilsService.getDocumentTypesCashOnline();
    this.documentExtensions = this.utilsService.getDocumentExtension();
  }

  ngOnChanges(): void {
    this.countErrors();
    this.changeLines();
  }

  ngAfterViewChecked(): void {
    $('tr').tooltip();
  }

  countErrors() {
    this.totalErrors = this.batchInformation.spreadsheet.filter(x => x.isError).length;
    this.totalCorrects = this.batchInformation.spreadsheet.filter(x => !x.isError).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.filter(x => x.isError));
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new SoliPaymentsSpreadsheetsResult();
    this.branchOffice = this.branchOffices[0];
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.detail.documentType === 'CI' ? this.documentExtensions[0].code : '';
    this.detail.mail = '';
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.length; i++) {
      this.batchInformation.spreadsheet[i].line = i + 1;
    }
  }

  handleShowEditForm($event: SoliPaymentsSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
  }

  handleRemove() {
    this.batchInformation.spreadsheet.splice(this.selectedRowIndex, 1);
    this.showRemoveRowForm = false;
    this.updateBatchAmount();
    this.changeLines();
    this.onRowChange.emit();
  }

  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.soliService.validateTransaction(this.detail)
      .subscribe({next: response => {
        this.detail.titular = response.titular;
        this.detail.companyCode = response.companyCode;
        this.detail.serviceCode = response.serviceCode;
        this.detail.paymentDetailId = response.paymentDetailId;
        this.detail.detail = response.detail;
        this.executeOperation();
        this.updateBatchAmount();
        this.showDetailForm = false;
        this.onRowChange.emit();
      }, error: _err => this.globalService.info('Nota: ', _err.message)});
    }
  }

  selectDocType() {
    if (this.detail.documentType !== 'CI') {
      this.detail.documentExtension = '';
    } else {
      this.detail.documentExtension = this.documentExtensions[0].code;
    }
  }

  handleCancel(): void {
    this.showDetailForm = false;
  }

  updateBatchAmount(): void {
    this.batchInformation.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
  }

  executeOperation(): void {
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.batchInformation.spreadsheet.length + 1;
        this.batchInformation.spreadsheet.push(this.detail);
        break;
      case Operation.update:
        this.detail.isError = false;
        this.batchInformation.spreadsheet[this.detail.line! - 1] = this.detail;
        break;
    }
  }
}
