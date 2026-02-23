import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked, HostListener } from '@angular/core';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { PaymentOddAchData } from '../../../../Services/mass-payments/Models/payment-odd-ach/payment-odd-ach-data';
import { NgForm } from '@angular/forms';
import { PaymentOddAchSpreadsheetResult } from '../../../../Services/mass-payments/Models/payment-odd-ach/payment-odd-ach-spreadsheet-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { PaymentAchService } from '../../../../Services/mass-payments/payment-ach.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { PaymentOddAchService } from '../../../../Services/mass-payments/payment-odd-ach.service';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-ach-odd-spreadsheet',
  standalone: false,
  templateUrl: './ach-odd-spreadsheet.component.html',
  styleUrls: ['./ach-odd-spreadsheet.component.css'],
  providers: [PaymentAchService, PaymentOddAchService, ParametersService, UtilsService]
})
export class AchOddSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

  headers = {
    line: true,
    amount: true,
    destinationAccount: true,
    bank: true,
    documentType: true,
    documentNumber: true,
    documentExtension: true,
    branchOffice: true,
    codeService: true,
    beneficiary: true,
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
  documentTypes!: ParameterResult[];
  documentExtensions!: ParameterResult[];
  detail: PaymentOddAchSpreadsheetResult = new PaymentOddAchSpreadsheetResult();
  @Input() spreadsheetPerPage!: PaymentOddAchSpreadsheetResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: PaymentOddAchData;
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
    this.branchOffices = this.utilsService.getBranchOffices();
    this.documentTypes = this.utilsService.getDocumentTypes();
    this.documentExtensions = this.utilsService.getDocumentExtension();
    this.achService.getBanksOdd()
      .subscribe({next: response => this.banks = response, error: _err => this.globalService.danger('Bancos', _err.message)});
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
    this.detail = new PaymentOddAchSpreadsheetResult();
    this.bank = this.banks[0];
    this.branchOffice = this.branchOffices[0];
    this.detail.typeIdc = this.documentTypes[0].description;
    this.detail.extensionIdc = this.documentExtensions[0].description;
    this.detail.mail = '';
    this.selectBank();
    this.selectBranchOffice();
  }

  selectBank() {
    this.detail.banksAchCode = this.bank.code;
    this.detail.bankDescription = this.bank.description;
  }

  selectBranchOffice() {
    this.detail.destinationBranchOfficeId = +this.branchOffice.code;
    this.detail.branchOfficeDescription = this.branchOffice.description;
  }

  selectDocType() {
    if (this.detail.typeIdc !== 'C.I.') {
      this.detail.extensionIdc = '';
    } else {
      this.detail.extensionIdc = this.documentExtensions[0].code;
    }
  }

  handleShowEditForm($event: PaymentOddAchSpreadsheetResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.bank = this.banks.find(x => x.code === this.detail.banksAchCode)!;
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
