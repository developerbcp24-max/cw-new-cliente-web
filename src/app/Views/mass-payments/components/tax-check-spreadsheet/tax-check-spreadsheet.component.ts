import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked, HostListener } from '@angular/core';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { PaymentTaxCheckData } from '../../../../Services/taxPaymentCheck/models/payment-tax-check-data';
import { PaymentTaxCheckSpreadsheetsResult } from '../../../../Services/taxPaymentCheck/models/payment-tax-check-spreadsheets-result';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-tax-check-spreadsheet',
  standalone: false,
  templateUrl: './tax-check-spreadsheet.component.html',
  styleUrls: ['./tax-check-spreadsheet.component.css'],
  providers: [ParametersService, UtilsService]
})
export class TaxCheckSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {
  headers = {
    line: true,
    amount: true,
    beneficiary: true,
    numberTransaction: true,
    documentType: true,
    documentNumber: true,
    documentExtension: true,
    addressDelivery: true,
    mail: true
  };
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  documentTypes!: ParameterResult[];
  documentExtensions!: ParameterResult[];
  branchOffices!: ParameterResult[];
  branchOffice: ParameterResult = new ParameterResult();
  detail: PaymentTaxCheckSpreadsheetsResult = new PaymentTaxCheckSpreadsheetsResult();
  @Input() spreadsheetPerPage!: PaymentTaxCheckSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: PaymentTaxCheckData;
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

  constructor(private globalService: GlobalService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.documentTypes = this.utilsService.getDocumentTypes();
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

  selectDocType() {
    if (this.detail.typeDocument !== 'C.I.') {
      this.detail.extensionDocument = '';
    } else {
      this.detail.extensionDocument = this.documentExtensions[0].code;
    }
  }

  setNewRow(): void {
    this.detail = new PaymentTaxCheckSpreadsheetsResult();
    this.detail.email = '';
    this.detail.typeDocument = this.documentTypes[0].description;
    this.detail.extensionDocument = this.documentExtensions[0].code;
  }


  handleShowEditForm($event: PaymentTaxCheckSpreadsheetsResult): void {
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

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.length; i++) {
      this.batchInformation.spreadsheet[i].line = i + 1;
    }
  }

  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.executeOperation();
      this.updateBatchAmount();
      this.showDetailForm = false;
      this.onRowChange.emit();
    }
  }

  handleCancel(): void {
    this.showDetailForm = false;
    this.setNewRow();
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
        this.batchInformation.spreadsheet[this.detail.line - 1] = this.detail;
        break;
    }
  }
}
