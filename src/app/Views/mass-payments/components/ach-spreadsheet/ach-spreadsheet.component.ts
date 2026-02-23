import { Component, OnInit, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewChecked, HostListener } from '@angular/core';
import { PaymentAchSpreadsheetResult } from '../../../../Services/mass-payments/Models/payment-ach/payment-ach-spreadsheet-result';
import { PaymentAchData } from '../../../../Services/mass-payments/Models/payment-ach/payment-ach-data';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
import { PaymentAchService } from '../../../../Services/mass-payments/payment-ach.service';
import { Operation } from '../../../../Services/mass-payments/Models/operation';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ErrorDetailResult } from '../../../../Services/mass-payments/Models/error-detail-result';
import { AccountAchDto } from '../../../../Services/mass-payments/Models/account-ach-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
//import { AuthenticationService } from 'src/app/Services/users/authentication.service';
declare let $: any;

@Component({
  selector: 'app-ach-spreadsheet',
  standalone: false,
  templateUrl: './ach-spreadsheet.component.html',
  styleUrls: ['./ach-spreadsheet.component.css'],
  providers: [PaymentAchService, ParametersService, UtilsService]
})
export class AchSpreadsheetComponent implements OnInit, OnChanges, AfterViewChecked {

  headers = {
    line: true,
    bankDescription: true,
    branchOfficeDescription: true,
    destinationAccount: true,
    targetAccount: true,
    beneficiary: true,
    beneficiaryValidado: false,
    amount: true,
    details: true,
    mail: true,
    documentType: true,
    documentNumber: true,
    documentExtension: true,
    validMessage: true,
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
  detail: PaymentAchSpreadsheetResult = new PaymentAchSpreadsheetResult();
  @Input() spreadsheetPerPage!: PaymentAchSpreadsheetResult[];
  @Input() visible: boolean | string | number = false;
  @Input() disabled = false;
  @Input() batchInformation!: PaymentAchData;
  @Input() accountDto!: AccountDto;
  @Output() onRowChange = new EventEmitter();
  @ViewChild('detailForm') form!: NgForm;
  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  errorsDetail: ErrorDetailResult[] = [];
  eventLog = new EventLogRequest();

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

  constructor(private globalService: GlobalService, private achService: PaymentAchService, private parametersService: ParametersService,
    private utilsService: UtilsService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.achService.getBanks()
      .subscribe({next: response => this.banks = response, error: _err => this.globalService.info('Bancos: ', _err.message)});
    this.branchOffices = this.utilsService.getBranchOffices();

    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;



  }

  ngOnChanges(): void {
    this.countErrors();
    this.changeLines();
    this.headers.beneficiaryValidado = false;
  }

  blurEventLogSpreedsheet(_typeText: number) {
    //not more
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
    this.detail = new PaymentAchSpreadsheetResult();
    this.bank = this.banks[0];
    this.branchOffice = this.branchOffices[0];
    this.detail.mail = '';
    this.selectBank();
    this.selectBranchOffice();
  }

  selectDocType() {
    if (this.detail.documentType !== 'C.I.') {
      this.detail.documentExtension = '';
    } else {
      this.detail.documentExtension = this.documentExtensions[0].code;
    }
  }

  selectBank() {
    this.detail.banksAchCode = this.bank.code;
    this.detail.bankDescription = this.bank.description;
  }

  selectBranchOffice() {
    this.detail.branchOfficeId = +this.branchOffice.code;
    this.detail.branchOfficeDescription = this.branchOffice.description;
  }

  changeEventLogSpreedsheet(typeDropdown: number) {
    if (localStorage.getItem('operationType') == "24") {
      if (typeDropdown == 1) {
        this.eventLog.eventName = "Seleccion de Banco";
        this.eventLog.previousData = this.detail.bankDescription != localStorage.getItem('bankDescription')! ? localStorage.getItem('bankDescription')! : "";
        this.eventLog.updateData = this.detail.bankDescription;
      }
      else {
        this.eventLog.eventName = "Seleccion de Ciudad";
        this.eventLog.previousData = this.detail.branchOfficeDescription != localStorage.getItem('branchOfficeDescription')! ? localStorage.getItem('branchOfficeDescription')! : "";
        this.eventLog.updateData = this.detail.branchOfficeDescription;
      }
      this.eventLog.eventType = "select";

      this.parametersService.saveEventLog(this.eventLog).subscribe();
    }
  }

  handleShowEditForm($event: PaymentAchSpreadsheetResult): void {

    this.detail = Object.assign({}, $event);
    if (this.detail.beneficiaryValidado == undefined) {
      this.detail.beneficiaryValidado = this.detail.beneficiary;
    }

    this.operation = Operation.update;
    this.bank = this.banks.find(x => x.code === this.detail.banksAchCode)!;
    this.branchOffice = this.branchOffices.find(x => x.description === this.detail.branchOfficeDescription)!;
    this.showDetailForm = true;

    // Para event log, si cambia el valor
    localStorage.setItem('bankDescription', this.detail.bankDescription);
    localStorage.setItem('branchOfficeDescription', this.detail.branchOfficeDescription);
    localStorage.setItem('targetAccount', this.detail.targetAccount);
    localStorage.setItem('beneficiary', this.detail.beneficiary);
    localStorage.setItem('amount', this.detail.amount.toString());
    localStorage.setItem('details', this.detail.details);
    localStorage.setItem('mail', this.detail.mail);
    localStorage.setItem('beneficiaryValidado', this.detail.beneficiary);
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
  handleValid() {
    if (!this.headers.beneficiaryValidado && this.detail.beneficiaryValidado == undefined) {
      for (let i = 0; i < this.batchInformation.spreadsheet.length; i++) {
        this.batchInformation.spreadsheet[i].beneficiaryValidado = this.spreadsheetPerPage[i].beneficiary;
      }
    } else if (this.detail.beneficiaryValidado != undefined) {
      this.setNewRow();
    }

  }

  handleValids() {
    if (this.detail.beneficiary == "" || this.detail.beneficiary == undefined) {
      this.detail.beneficiary = "--"
    }
  }
  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    this.handleValids();
    if (this.form.valid) {
      this.verifyAccountACH();
    }
  }

  handleCancel(): void {
    this.showDetailForm = false;
    this.setNewRow();
  }

  clickEventLogSpreedsheet(typeButton: number) {
    if (localStorage.getItem('operationType') == "24") {

      switch (typeButton) {
        case 1:
          this.eventLog.eventName = "Click Guardar planilla manual";
          this.eventLog.previousData = "";
          this.eventLog.updateData = "";
          break;
        case 2:
          this.eventLog.eventName = "Click Cancelar planilla manual";
          this.eventLog.previousData = "";
          this.eventLog.updateData = "";
          break;
        case 3:
          this.eventLog.eventName = "Click Eliminar planilla";
          this.eventLog.previousData = "";
          this.eventLog.updateData = "";
          break;
        case 4:
          this.eventLog.eventName = "Click Editar planilla";
          this.eventLog.previousData = "";
          this.eventLog.updateData = "";
          break;
      }
      this.eventLog.eventType = "button";

      this.parametersService.saveEventLog(this.eventLog).subscribe();
    }
  }

  updateBatchAmount(): void {
    this.batchInformation.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
  }

  executeOperation(): void {
    if (this.detail.banksAchCode == this.detail.bankAlias) {
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
    } else if (this.detail.banksAchCode != this.detail.bankAlias || this.detail.banksAchCode == undefined) {
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

  verifyAccountACH() {

    this.achService.verifyAccountACHes(new AccountAchDto({
      accountNumber: this.detail.targetAccount
    }))
      .subscribe({next: response => {
        if (response.isValid !== null) {
          if (this.detail.beneficiary == "--") {
            this.detail.beneficiary = response.titularAccount;
          }
          this.detail.beneficiaryValidado = response.titularAccount;
          this.detail.bankAlias = response.banckAlias;
          this.executeOperation();
          this.updateBatchAmount();
          if (this.detail.banksAchCode == this.detail.bankAlias) {
            this.detail.validMessage = "Cuenta validada";
            this.onRowChange.emit();
            this.showDetailForm = false;
          } else if (this.detail.banksAchCode != this.detail.bankAlias) {
            this.detail.validMessage = "Cuenta no Validada o Banco no validada";
            this.onRowChange.emit();
            this.showDetailForm = false;
          } else {
            this.detail.validMessage = "Cuenta no validada";
            this.onRowChange.emit();
            this.showDetailForm = false;
          }
        } else {
          this.executeOperation();
          this.updateBatchAmount();
          this.showDetailForm = false;
          this.detail.validMessage = "Cuenta no validada";
          this.onRowChange.emit();
        }
      }, error: _err => {
        this.executeOperation();
        this.updateBatchAmount();
        this.showDetailForm = false;
        this.detail.validMessage = "Cuenta no validada";
        this.detail.beneficiaryValidado = "TITULAR NO ENCONTRADO";
        this.onRowChange.emit();
      }});
  }
}

