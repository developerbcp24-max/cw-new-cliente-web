import { Component, OnInit, EventEmitter, ViewChild, Output, Input, AfterViewChecked, OnChanges, HostListener } from '@angular/core';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { NgForm } from '@angular/forms';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ProvidersCheckManagementSpreadsheetsResult } from '../../../../Services/providersCheckManagement/models/providers-check-management-spreadsheets-result';
import { ProvidersCheckManagementData } from '../../../../Services/providersCheckManagement/models/providers-check-management-data';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
declare let $: any;

@Component({
  selector: 'app-check-management-spreadsheet',
  standalone: false,
  templateUrl: './check-management-spreadsheet.component.html',
  styleUrls: ['./check-management-spreadsheet.component.css'],
  providers: [ParametersService, UtilsService]
})
export class CheckManagementSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

  headers = {
    line: true,
    amount: true,
    beneficiary: true,
    instructions: true,
    placeDelivery: true,
    detail: true,
    mail: true
  };
  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  placeDeliveries!: ParameterResult[];
  placeDelivery: ParameterResult = new ParameterResult;
  detail: ProvidersCheckManagementSpreadsheetsResult = new ProvidersCheckManagementSpreadsheetsResult();
  @Input() spreadsheetPerPage!: ProvidersCheckManagementSpreadsheetsResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: ProvidersCheckManagementData;
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

  constructor(private globalService: GlobalService, private parametersService: ParametersService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.parametersService.getByGroup(new ParameterDto({ group: 'CODOF' }))
      .subscribe({next: response => this.placeDeliveries = response,
        error: _err => this.globalService.danger('Parámetros', _err.message)});
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
    this.detail = new ProvidersCheckManagementSpreadsheetsResult();
    this.detail.placeDelivery = this.placeDeliveries[0].description;
    this.detail.emailProvider = '';
  }

  handleShowEditForm($event: ProvidersCheckManagementSpreadsheetsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.detail.emailProvider = this.detail.emailProvider === undefined || this.detail.emailProvider === null ? '' : this.detail.emailProvider.trim();
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
