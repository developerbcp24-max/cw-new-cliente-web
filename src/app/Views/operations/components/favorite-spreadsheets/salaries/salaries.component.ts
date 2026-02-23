import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked } from '@angular/core';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { FavoritePaymentsSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-spreadsheets-result';
import { FavoritePaymentsData } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { SalariesPaymentsService } from '../../../../../Services/mass-payments/salaries-payments.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { ParameterDto } from '../../../../../Services/parameters/models/parameter-dto';
import { Operation } from '../../../../../Services/mass-payments/Models/operation';
import { AccountClientDto } from '../../../../../Services/mass-payments/Models/account-client-dto';
import { ErrorDetailResult } from '../../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-salaries',
  standalone: false,
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css'],
  providers: [SalariesPaymentsService, ParametersService, UtilsService]
})
export class SalariesComponent implements OnInit, OnChanges, AfterViewChecked {
  headers = {
    line: true,
    code: true,
    account: true,
    gloss: true,
    amount: true,
    documentType: true,
    document: true,
    documentExtension: true,
    titular: true,
    firstDetail: true,
    secondDetail: true,
    email: true,
    phone: true
  };
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  documentTypes!: ParameterResult[];
  documentExtensions!: ParameterResult[];
  detail: FavoritePaymentsSpreadsheetsResult = new FavoritePaymentsSpreadsheetsResult();
  @Input()
  spreadsheetPerPage!: FavoritePaymentsSpreadsheetsResult[];
  @Input() visible = false;
  @Input()
  batchInformation!: FavoritePaymentsData;
  @Input() disabled = false;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm')
  form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  lineSelected!: number;
  errorsDetail: ErrorDetailResult[] = [];


  constructor(private globalService: GlobalService, private salariesService: SalariesPaymentsService, private parametersService: ParametersService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.parametersService.getByGroup(new ParameterDto({ group: 'TIPDOC' }))
      .subscribe({next: response => this.documentTypes = response, error: _err => this.globalService.danger('Parámetros', _err.message)});
    this.parametersService.getByGroup(new ParameterDto({ group: 'LUGEXT' }))
      .subscribe({next: response => this.documentExtensions = response, error: _err => this.globalService.danger('Parámetros', _err.message)});
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
    this.totalErrors = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.isError && x.operationStatusId !== 8).length;
    this.totalCorrects = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => !x.isError && x.operationStatusId !== 8).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.isError && x.operationStatusId !== 8));
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.detail.mail = '';
    this.detail.telephoneNumber = '';
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new FavoritePaymentsSpreadsheetsResult();
    this.detail.isNew = true;
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.documentExtensions[0].code;
  }

  handleShowEditForm($event: FavoritePaymentsSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.detail.telephoneNumber = this.detail.telephoneNumber === undefined || this.detail.telephoneNumber === null ? '' : this.detail.telephoneNumber.trim();
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
    this.lineSelected = index;
  }

  handleRemove() {
    if (this.batchInformation.spreadsheet.formSalariesPayments.find(x => x.line === this.lineSelected)!.isNew) {
      this.batchInformation.spreadsheet.formSalariesPayments.splice(this.selectedRowIndex, 1);
    } else {
      this.batchInformation.spreadsheet.formSalariesPayments.find(x => x.line === this.lineSelected)!.operationStatusId = 8;
      this.batchInformation.spreadsheet.formSalariesPayments.find(x => x.line === this.lineSelected)!.isDeleted = true;
    }
    this.showRemoveRowForm = false;
    this.changeLines();
    this.onRowChange.emit();
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.operationStatusId !== 8).length; i++) {
      this.batchInformation.spreadsheet.formSalariesPayments[i].line = i + 1;
    }
  }

  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.verifyAccount();
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
        this.detail.line = this.batchInformation.spreadsheet.formSalariesPayments.length + 1;
        this.detail.operationStatusId = 1;
        this.batchInformation.spreadsheet.formSalariesPayments.push(this.detail);
        break;
      case Operation.update:
        this.detail.isError = false;
        this.detail.errorMessages = '';
        this.detail.code = this.detail.code.toUpperCase();
        this.detail.operationStatusId = 1;
        this.batchInformation.spreadsheet.formSalariesPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }

  selectDocType() {
    if (this.detail.documentType !== 'C.I.') {
      this.detail.documentExtension = '';
    } else {
      this.detail.documentExtension = this.documentExtensions[0].code;
    }
  }

  verifyAccount(): void {
    this.salariesService.verifyAccount(new AccountClientDto({
      accountNumber: this.detail.accountNumber,
      documentType: this.detail.documentType,
      documentNumber: this.detail.documentNumber,
      documentExtension: this.detail.documentExtension
    }))
      .subscribe({next: response => {
        if (response.titularAccount !== null) {
          this.executeOperation();
          this.batchInformation.spreadsheet.formSalariesPayments.forEach(x => x.paymentType = 'HAB');
          this.showDetailForm = false;
          this.detail.titularName = response.titularAccount;
          this.onRowChange.emit();
        } else {
          this.globalService.danger('Número de cuenta erroneo', 'No se pudo verificar el titular de la cuenta.');
        }
      }, error: _err => this.globalService.danger('Pago a proveedores abono en cuenta', _err.message)});
  }
}

