import { AfterViewChecked, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { CashPaymentsSpreadsheetsResult } from '../../../../Services/mass-payments/Models/cash-payments/cash-payments-spreadsheets-result';
import { CashPaymentData } from '../../../../Services/mass-payments/Models/cash-payments/cash-payment-data';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
/* import { CashPaymentData } from 'src/app/Services/mass-payments/Models/cash-payments/cash-payment-data';
import { CashPaymentsSpreadsheetsResult } from 'src/app/Services/mass-payments/Models/cash-payments/cash-payments-spreadsheets-result';
import { ErrorDetailResult } from 'src/app/Services/mass-payments/Models/error-detail-result';
import { Operation } from 'src/app/Services/mass-payments/Models/operation';
import { ParameterResult } from 'src/app/Services/parameters/models/parameter-result';
import { ParametersService } from 'src/app/Services/parameters/parameters.service';
import { GlobalService } from 'src/app/Services/shared/global.service';
import { UtilsService } from 'src/app/Services/shared/utils.service'; */
declare let $: any;

@Component({
  selector: 'app-cash-spreadsheet',
  standalone: false,
  templateUrl: './cash-spreadsheet.component.html',
  styleUrls: ['./cash-spreadsheet.component.css'],
  providers: [ParametersService, UtilsService]
})
export class CashSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

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
  detail: CashPaymentsSpreadsheetsResult = new CashPaymentsSpreadsheetsResult();
  @Input() spreadsheetPerPage!: CashPaymentsSpreadsheetsResult[];
  @Input() visible:any = false;
  @Input() disabled = false;
  @Input() batchInformation!: CashPaymentData;
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

  constructor(private globalService: GlobalService, private utilsService: UtilsService) { }

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

  setNewRow(): void {
    this.detail = new CashPaymentsSpreadsheetsResult();
    this.branchOffice = this.branchOffices[0];
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.detail.documentType === 'C.I' ? this.documentExtensions[0].code : '';
    this.detail.mail = '';
    this.selectBranchOffice();
  }

  selectBranchOffice() {
    this.detail.branchOfficeId = this.branchOffice.code;
    this.detail.branchOfficeDescription = this.branchOffice.description;
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.length; i++) {
      this.batchInformation.spreadsheet[i].line = i + 1;
    }
  }

  handleShowEditForm($event: CashPaymentsSpreadsheetsResult): void {
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
    this.batchInformation.spreadsheet.splice(this.selectedRowIndex, 1);
    this.showRemoveRowForm = false;
    this.updateBatchAmount();
    this.changeLines();
    this.onRowChange.emit();
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
