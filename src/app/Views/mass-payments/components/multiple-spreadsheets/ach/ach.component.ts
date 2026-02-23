import { Component, OnInit, OnChanges, EventEmitter, Input, Output, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { MultiplePaymentSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/multiple-payments/multiple-payment-spreadsheets-result';
import { Operation } from '../../../../../Services/mass-payments/Models/operation';
import { MultiplePaymentsData } from '../../../../../Services/mass-payments/Models/multiple-payments/multiple-payments-data';
import { NgForm } from '@angular/forms';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { PaymentAchService } from '../../../../../Services/mass-payments/payment-ach.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { ErrorDetailResult } from '../../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-ach',
  standalone: false,
  templateUrl: './ach.component.html',
  styleUrls: ['./ach.component.css'],
  providers: [PaymentAchService, ParametersService, UtilsService]
})
export class AchComponent implements OnInit, OnChanges, AfterViewChecked {
  headers = {
    line: true,
    bankDescription: true,
    branchOfficeDescription: true,
    destinationAccount: true,
    targetAccount: true,
    beneficiary: true,
    amount: true,
    details: true,
    mail: true
  };
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  banks!: ParameterResult[];
  bank: ParameterResult = new ParameterResult;
  branchOffices!: ParameterResult[];
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

  constructor(private globalService: GlobalService, private achService: PaymentAchService, private parametersService: ParametersService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.achService.getBanks()
      .subscribe({next: response => this.banks = response,
        error: _err => this.globalService.danger('Bancos', _err.message)});
      this.branchOffices = this.utilsService.getBranchOffices();
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
    this.totalErrors = this.batchInformation.spreadsheet.formAchPayments.filter(x => x.isError).length;
    this.totalCorrects = this.batchInformation.spreadsheet.formAchPayments.filter(x => !x.isError).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.formAchPayments.filter(x => x.isError));
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new MultiplePaymentSpreadsheetsResult();
    this.bank = this.banks[0];
    this.branchOffice = this.branchOffices[0];
    this.detail.mail = '';
    this.selectBank();
    this.selectBranchOffice();
  }

  selectBank() {
    this.detail.bankId = this.bank.code;
    this.detail.bankDescription = this.bank.description;
  }

  selectBranchOffice() {
    this.detail.branchOfficeId = +this.branchOffice.code;
    this.detail.branchOfficeDescription = this.branchOffice.description;
  }

  handleShowEditForm($event: MultiplePaymentSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.bank = this.banks.find(x => x.code === this.detail.bankId)!;
    this.branchOffice = this.branchOffices.find(x => x.description === this.detail.branchOfficeDescription)!;
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
  }

  handleRemove() {
    this.batchInformation.spreadsheet.formAchPayments.splice(this.selectedRowIndex, 1);
    this.showRemoveRowForm = false;
    this.changeLines();
    this.onRowChange.emit();
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.formAchPayments.length; i++) {
      this.batchInformation.spreadsheet.formAchPayments[i].line = i + 1;
    }
  }

  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.executeOperation();
      this.batchInformation.spreadsheet.formAchPayments.forEach(x => x.paymentType = 'ACH');
      this.showDetailForm = false;
      this.onRowChange.emit();
    }
  }

  handleCancel(): void {
    this.showDetailForm = false;
    this.setNewRow();
  }

  executeOperation(): void {
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.batchInformation.spreadsheet.formAchPayments.length + 1;
        this.batchInformation.spreadsheet.formAchPayments.push(this.detail);
        break;
      case Operation.update:
        this.detail.isError = false;
        this.batchInformation.spreadsheet.formAchPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }
}
