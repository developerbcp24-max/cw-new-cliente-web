import { Component, OnInit, OnChanges, AfterViewChecked, EventEmitter, Input, Output, ViewChild, HostListener } from '@angular/core';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { PaymentAchService } from '../../../../Services/mass-payments/payment-ach.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { ProvidersDepositInOtherBankCheckSpreadsheetsResult } from '../../../../Services/providersDepositInOtherBankCheck/models/providers-deposit-in-other-bank-check-spreadsheets-result';
import { ProvidersDepositInOtherBankCheckData } from '../../../../Services/providersDepositInOtherBankCheck/models/providers-deposit-in-other-bank-check-data';
import { NgForm } from '@angular/forms';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-deposit-other-bank-check-spreadsheet',
  standalone: false,
  templateUrl: './deposit-other-bank-check-spreadsheet.component.html',
  styleUrls: ['./deposit-other-bank-check-spreadsheet.component.css'],
  providers: [PaymentAchService, UtilsService]
})
export class DepositOtherBankCheckSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

  headers = {
    line: true,
    destinationAccount: true,
    amount: true,
    beneficiary: true,
    instructions: true,
    detail: true,
    bank: true,
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
  detail: ProvidersDepositInOtherBankCheckSpreadsheetsResult = new ProvidersDepositInOtherBankCheckSpreadsheetsResult();
  @Input() spreadsheetPerPage!: ProvidersDepositInOtherBankCheckSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: ProvidersDepositInOtherBankCheckData;
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

  constructor(private globalService: GlobalService, private achService: PaymentAchService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.achService.getBanks()
      .subscribe({next: response => this.banks = response,
        error: _err => this.globalService.danger('Bancos', _err.message)});
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
    this.detail = new ProvidersDepositInOtherBankCheckSpreadsheetsResult();
    this.bank = this.banks[0];
    this.detail.emailProvider = '';
    this.selectBank();
  }

  selectBank() {
    this.detail.bank = this.bank.code;
    this.detail.bankDescription = this.bank.description;
  }


  handleShowEditForm($event: ProvidersDepositInOtherBankCheckSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.bank = this.banks.find(x => x.code === this.detail.bank)!;
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
