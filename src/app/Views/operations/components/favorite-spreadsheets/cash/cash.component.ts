import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked } from '@angular/core';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { FavoritePaymentsSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-spreadsheets-result';
import { FavoritePaymentsData } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { ParameterDto } from '../../../../../Services/parameters/models/parameter-dto';
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
    code: true,
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
  detail: FavoritePaymentsSpreadsheetsResult = new FavoritePaymentsSpreadsheetsResult();
  @Input()
  spreadsheetPerPage!: FavoritePaymentsSpreadsheetsResult[];
  @Input() visible = false;
  @Input() disabled = false;
  @Input()
  batchInformation!: FavoritePaymentsData;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm')
  form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];
  lineSelected!: number;

  constructor(private globalService: GlobalService, private parametersService: ParametersService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.parametersService.getByGroup(new ParameterDto({ group: 'TIPDOC' }))
      .subscribe({next: response => this.documentTypes = response, error: _err => this.globalService.danger('Parámetros', _err.message)});
    this.parametersService.getByGroup(new ParameterDto({ group: 'LUGEXT' }))
      .subscribe({next: response => this.documentExtensions = response, error: _err => this.globalService.danger('Parámetros', _err.message)});
    this.parametersService.getByGroup(new ParameterDto({ group: 'CODSUC' }))
      .subscribe({next: response => this.branchOffices = response, error: _err => this.globalService.danger('Parámetros', _err.message)});
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
    this.totalErrors = this.batchInformation.spreadsheet.formCashPayments.filter(x => x.isError && x.operationStatusId !== 8).length;
    this.totalCorrects = this.batchInformation.spreadsheet.formCashPayments.filter(x => !x.isError && x.operationStatusId !== 8).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.formCashPayments.filter(x => x.isError && x.operationStatusId !== 8));
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new FavoritePaymentsSpreadsheetsResult();
    this.detail.isNew = true;
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
    for (let i = 0; i < this.batchInformation.spreadsheet.formCashPayments.filter(x => x.operationStatusId !== 8).length; i++) {
      this.batchInformation.spreadsheet.formCashPayments[i].line = i + 1;
    }
  }

  handleShowEditForm($event: FavoritePaymentsSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.branchOffice = this.branchOffices.find(x => x.description === this.detail.branchOfficeDescription)!;
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
    this.lineSelected = index;
  }

  handleRemove() {
    if (this.batchInformation.spreadsheet.formCashPayments.find(x => x.line === this.lineSelected)!.isNew) {
      this.batchInformation.spreadsheet.formCashPayments.splice(this.selectedRowIndex, 1);
    } else {
      this.batchInformation.spreadsheet.formCashPayments.find(x => x.line === this.lineSelected)!.operationStatusId = 8;
      this.batchInformation.spreadsheet.formCashPayments.find(x => x.line === this.lineSelected)!.isDeleted = true;
    }
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
        this.detail.code = this.detail.code.toUpperCase();
        this.detail.line = this.batchInformation.spreadsheet.formCashPayments.length + 1;
        this.detail.operationStatusId = 1;
        this.batchInformation.spreadsheet.formCashPayments.push(this.detail);
        break;
      case Operation.update:
        this.detail.code = this.detail.code.toUpperCase();
        this.detail.isError = false;
        this.detail.errorMessages = '';
        this.detail.operationStatusId = 1;
        this.batchInformation.spreadsheet.formCashPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }
}

