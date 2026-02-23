import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, AfterViewChecked } from '@angular/core';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { FavoritePaymentsSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-spreadsheets-result';
import { FavoritePaymentsData } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { PaymentAchService } from '../../../../../Services/mass-payments/payment-ach.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { ParameterDto } from '../../../../../Services/parameters/models/parameter-dto';
import { Operation } from '../../../../../Services/mass-payments/Models/operation';
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
    code: true,
    bankDescription: true,
    branchOfficeDescription: true,
    destinationAccount: true,
    targetAccount: true,
    beneficiary: true,
    amount: true,
    details: true,
    mail: true
  };
  showFilter: any;
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  banks!: ParameterResult[];
  bank: ParameterResult = new ParameterResult;
  branchOffices!: ParameterResult[];
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

  constructor(private globalService: GlobalService, private achService: PaymentAchService, private parametersService: ParametersService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.achService.getBanks()
      .subscribe({next: response => this.banks = response, error: _err => this.globalService.danger('Bancos', _err.message)});
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
    this.totalErrors = this.batchInformation.spreadsheet.formAchPayments.filter(x => x.isError && x.operationStatusId !== 8).length;
    this.totalCorrects = this.batchInformation.spreadsheet.formAchPayments.filter(x => !x.isError && x.operationStatusId !== 8).length;
    this.haveErrors = this.totalErrors > 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet.formAchPayments.filter(x => x.isError && x.operationStatusId !== 8));
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.showDetailForm = true;
  }

  setNewRow(): void {
    this.detail = new FavoritePaymentsSpreadsheetsResult();
    this.detail.isNew = true;
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

  handleShowEditForm($event: FavoritePaymentsSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.bank = this.banks.find(x => x.code === this.detail.bankId)!;
    this.branchOffice = this.branchOffices.find(x => x.description === this.detail.branchOfficeDescription)!;
    this.showDetailForm = true;
  }

  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
    this.lineSelected = index;
  }

  handleRemove() {
    if (this.batchInformation.spreadsheet.formAchPayments.find(x => x.line === this.lineSelected)!.isNew) {
      this.batchInformation.spreadsheet.formAchPayments.splice(this.selectedRowIndex, 1);
    } else {
      this.batchInformation.spreadsheet.formAchPayments.find(x => x.line === this.lineSelected)!.operationStatusId = 8;
      this.batchInformation.spreadsheet.formAchPayments.find(x => x.line === this.lineSelected)!.isDeleted = true;
    }
    this.showRemoveRowForm = false;
    this.changeLines();
    this.onRowChange.emit();
  }

  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet.formAchPayments.filter(x => x.operationStatusId !== 8).length; i++) {
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
        this.detail.code = this.detail.code.toUpperCase();
        this.detail.line = this.batchInformation.spreadsheet.formAchPayments.length + 1;
        this.detail.operationStatusId = 1;
        this.batchInformation.spreadsheet.formAchPayments.push(this.detail);
        break;
      case Operation.update:
        this.detail.code = this.detail.code.toUpperCase();
        this.detail.isError = false;
        this.detail.errorMessages = '';
        this.detail.operationStatusId = 1;
        this.batchInformation.spreadsheet.formAchPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }
}
