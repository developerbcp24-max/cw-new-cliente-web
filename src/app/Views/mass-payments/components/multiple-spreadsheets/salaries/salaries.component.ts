import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked, HostListener } from '@angular/core';
import { MultiplePaymentSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/multiple-payments/multiple-payment-spreadsheets-result';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { SalariesPaymentsService } from '../../../../../Services/mass-payments/salaries-payments.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { ParameterDto } from '../../../../../Services/parameters/models/parameter-dto';
import { Operation } from '../../../../../Services/mass-payments/Models/operation';
import { MultiplePaymentsData } from '../../../../../Services/mass-payments/Models/multiple-payments/multiple-payments-data';
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
export class SalariesComponent implements OnInit, OnChanges, AfterViewChecked  {

  headers = {
    line: true,
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
  detail: MultiplePaymentSpreadsheetsResult = new MultiplePaymentSpreadsheetsResult();
  @Input() spreadsheetPerPage!: MultiplePaymentSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() batchInformation!: MultiplePaymentsData;
  @Input() disabled = false;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
errorsDetail: ErrorDetailResult[] = [];
isValidateCurreny = false;
sameCurrency = false;

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

  constructor(private globalService: GlobalService, private salariesService: SalariesPaymentsService, private parametersService: ParametersService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.parametersService.getByGroupAndCode(new ParameterDto ({group:'RESUSD',code:'USD'}))
      .subscribe({next: resp => this.sameCurrency = resp.value == 'A' });
      this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TICKET', code: 'MDD' }))
          .subscribe({next: response => this.isValidateCurreny = response.value == 'A'});
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
    if (this.isValidateCurreny || this.sameCurrency) {
      this.validateCurrency();
    }
    this.batchInformation.spreadsheet.formSalariesPayments.forEach(x => x.errorMessages = x.errorMessages?.replaceAll('<br>', ''));
    this.totalErrors = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.isError).length;
    this.totalCorrects = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => !x.isError).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.isError));
  }

  validateCurrency() {
    for (const item of this.batchInformation.spreadsheet.formSalariesPayments) {
      let acc = item.accountNumber.substring(item.accountNumber.length - 3);
      let newAcc = acc.charAt(0);
      let newCurrency = newAcc == '3' ? 'BOL' : 'USD';
      item.errorMessages = item.errorMessages == null ? '' : item.errorMessages;
      if (this.batchInformation.currency == 'BOL' && this.batchInformation.sourceCurrency == 'BOL' && newCurrency == 'USD') {
        item.isError = true;
        if (!item.errorMessages.includes('Por favor debe seleccionar una cuenta en BOLIVIANOS')) {
          item.errorMessages = item.errorMessages + 'Por favor debe seleccionar una cuenta en BOLIVIANOS.';
        }
      }
    }
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.detail.mail = '';
    this.detail.telephoneNumber = '';
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new MultiplePaymentSpreadsheetsResult();
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.documentExtensions[0].code;
  }

  handleShowEditForm($event: MultiplePaymentSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.detail.telephoneNumber = this.detail.telephoneNumber === undefined || this.detail.telephoneNumber === null ? '' : this.detail.telephoneNumber.trim();
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
  }

  handleRemove() {
    this.batchInformation.spreadsheet.formSalariesPayments.splice(this.selectedRowIndex, 1);
    this.showRemoveRowForm = false;
    this.changeLines();
    this.onRowChange.emit();
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.formSalariesPayments.length; i++) {
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
        this.detail.line = this.batchInformation.spreadsheet.formSalariesPayments.length + 1;
        this.batchInformation.spreadsheet.formSalariesPayments.push(this.detail);
        break;
      case Operation.update:
        this.detail.isError = false;
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
    this.salariesService.verifyAccount(new AccountClientDto({ accountNumber: this.detail.accountNumber,
      documentType: this.detail.documentType,
      documentNumber: this.detail.documentNumber,
      documentExtension: this.detail.documentExtension}))
      .subscribe({next: response => {
        if (response.titularAccount !== null) {
          this.executeOperation();
          this.batchInformation.spreadsheet.formSalariesPayments.forEach(x => x.paymentType = 'HAB');
          this.showDetailForm = false;
          this.detail.titularName = response.titularAccount;
          this.detail.documentExtension = this.detail.documentExtension == "SN" ? "" : this.detail.documentExtension;
          this.onRowChange.emit();
        } else {
          this.globalService.danger('Número de cuenta erroneo', 'No se pudo verificar el titular de la cuenta.');
        }
      }, error: _err => this.globalService.danger('Pago a proveedores abono en cuenta', _err.message)});
  }
}
