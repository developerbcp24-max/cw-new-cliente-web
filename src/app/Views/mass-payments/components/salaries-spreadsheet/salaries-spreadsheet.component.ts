import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { SalariesPaymentData } from '../../../../Services/mass-payments/Models/salaries-payments/salaries-payment-data';
import { SalariesPaymentsSpreadsheetsResult } from '../../../../Services/mass-payments/Models/salaries-payments/salaries-payments-spreadsheets-result';
import { SalariesPaymentsService } from '../../../../Services/mass-payments/salaries-payments.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AccountClientDto } from '../../../../Services/mass-payments/Models/account-client-dto';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-salaries-spreadsheet',
  standalone: false,
  templateUrl: './salaries-spreadsheet.component.html',
  styleUrls: ['./salaries-spreadsheet.component.css'],
  providers: [SalariesPaymentsService, ParametersService, UtilsService]
})
export class SalariesSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

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
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];
  operation!: number;
  selectedRowIndex!: number;
  documentTypes!: ParameterResult[];
  documentExtensions!: ParameterResult[];
  detail: SalariesPaymentsSpreadsheetsResult = new SalariesPaymentsSpreadsheetsResult();
  @Input() spreadsheetPerPage!: SalariesPaymentsSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() batchInformation!: SalariesPaymentData;
  @Input() disabled = false;
  @Input() sourceCurrency!: string;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;

  @ViewChild('insideButton') insideButton: any;
  @ViewChild('insideElement') insideElement: any;
  showFilter = false;
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
  isValidateCurreny = false;
  sameCurrency = false;

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
  }

  ngAfterViewChecked(): void {
    $('tr').tooltip();
  }

  countErrors() {
    if (this.isValidateCurreny || this.sameCurrency) {
      this.validateCurrency();
    }
    this.batchInformation.spreadsheet.forEach(x => x.errorMessages = x.errorMessages?.replaceAll('<br>', ''));
    this.totalErrors = this.batchInformation.spreadsheet.filter(x => x.isError).length;
    this.totalCorrects = this.batchInformation.spreadsheet.filter(x => !x.isError).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.filter(x => x.isError));
  }

  validateCurrency() {
    for (const item of this.batchInformation.spreadsheet) {
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
    this.detail.email = '';
    this.detail.telephoneNumber = '';
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new SalariesPaymentsSpreadsheetsResult();
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.documentExtensions[0].code;
  }

  handleShowEditForm($event: SalariesPaymentsSpreadsheetsResult): void {
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
      this.verifyAccount();
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
      .subscribe({
        next: response => {
          if (response.titularAccount !== null) {
            this.executeOperation();
            this.updateBatchAmount();
            this.showDetailForm = false;
            this.detail.titular = response.titularAccount;

            this.detail.documentExtension = this.detail.documentExtension == "SN" ? "" : this.detail.documentExtension;
            this.onRowChange.emit();
          } else {
            this.globalService.danger('Número de cuenta erroneo', 'No se pudo verificar el titular de la cuenta.');
          }
        }, error: _err => this.globalService.danger('Pago a proveedores abono en cuenta', _err.message)
      });
  }
}
