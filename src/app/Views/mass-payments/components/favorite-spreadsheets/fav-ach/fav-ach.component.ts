import { Component, OnInit, EventEmitter, OnChanges, AfterViewChecked, ViewChild, Output, Input, HostListener } from '@angular/core';
import { ParameterResult } from '../../../../../Services/parameters/models/parameter-result';
import { FavoritePaymentsSpreadsheetsResult } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-spreadsheets-result';
import { FavoritePaymentsData } from '../../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { PaymentAchService } from '../../../../../Services/mass-payments/payment-ach.service';
import { ParametersService } from '../../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';
import { Operation } from '../../../../../Services/mass-payments/Models/operation';
import { ErrorDetailResult } from '../../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-fav-ach',
  standalone: false,
  templateUrl: './fav-ach.component.html',
  styleUrls: ['./fav-ach.component.css'],
  providers: [PaymentAchService, ParametersService, UtilsService]
})
export class FavAchComponent implements OnInit, OnChanges, AfterViewChecked {
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
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  banks!: ParameterResult[];
  bank: ParameterResult = new ParameterResult;
  branchOffices!: ParameterResult[];
  branchOffice: ParameterResult = new ParameterResult();
  detail: FavoritePaymentsSpreadsheetsResult = new FavoritePaymentsSpreadsheetsResult();
  @Input() spreadsheetPerPage!: FavoritePaymentsSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: FavoritePaymentsData;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];

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

  constructor(private globalService: GlobalService, private utilsService: UtilsService) { }

  ngOnInit() {
    /*This is intentional*/
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
  }

  executeOperation(): void {
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.batchInformation.spreadsheet.formAchPayments.length + 1;
        this.batchInformation.spreadsheet.formAchPayments.push(this.detail);
        break;
      case Operation.update:
        this.batchInformation.spreadsheet.formAchPayments[this.detail.line - 1] = this.detail;
        break;
    }
  }
}
