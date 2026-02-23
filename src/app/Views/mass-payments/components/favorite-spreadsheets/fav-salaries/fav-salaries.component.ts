import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked, HostListener } from '@angular/core';
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
import { ErrorDetailResult } from '../../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-fav-salaries',
  standalone: false,
  templateUrl: './fav-salaries.component.html',
  styleUrls: ['./fav-salaries.component.css'],
  providers: [SalariesPaymentsService, ParametersService, UtilsService]
})
export class FavSalariesComponent implements OnInit, OnChanges, AfterViewChecked {

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
  @Input() spreadsheetPerPage!: FavoritePaymentsSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() batchInformation!: FavoritePaymentsData;
  @Input() disabled = false;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];
  isValidateCurreny = false;
  sameCurrency = false

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

  constructor(private globalService: GlobalService, private utilsService: UtilsService, private parametersService: ParametersService) { }

  ngOnInit() {
    this.parametersService.getByGroupAndCode(new ParameterDto ({group:'RESUSD',code:'USD'}))
      .subscribe({next: resp => this.sameCurrency = resp.value == 'A' });
      this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TICKET', code: 'MDD' }))
          .subscribe({next: response => this.isValidateCurreny = response.value == 'A'});
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

  handleCheck($row: FavoritePaymentsSpreadsheetsResult) {
    this.detail = Object.assign({}, $row);
    this.detail.isChecked = !$row.isChecked;
    this.operation = Operation.update;
    this.executeOperation();
    this.onRowChange.emit();
  }

  handleShowEditForm($event: FavoritePaymentsSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.showDetailForm = true;
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.formSalariesPayments.length; i++) {
      this.batchInformation.spreadsheet.formSalariesPayments[i].line = i + 1;
    }
  }

  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.executeOperation();
      this.showDetailForm = false;
      this.onRowChange.emit();
    }
  }

  handleCancel(): void {
    this.showDetailForm = false;
  }

  executeOperation(): void {
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.batchInformation.spreadsheet.formSalariesPayments.length + 1;
        this.batchInformation.spreadsheet.formSalariesPayments.push(this.detail);
        break;
      case Operation.update:
        this.batchInformation.spreadsheet.formSalariesPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }
}
