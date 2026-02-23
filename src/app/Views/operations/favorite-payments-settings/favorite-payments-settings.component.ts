import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { GlobalService } from '../../../Services/shared/global.service';
import { MassivePaymentsSpreadsheetsDto } from '../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { Constants } from '../../../Services/shared/enums/constants';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { UtilsService } from '../../../Services/shared/utils.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { FavoritePaymentsSpreadsheetsResult } from '../../../Services/mass-payments/Models/favorite-payments/favorite-payments-spreadsheets-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { FavoritePaymentsData } from '../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { MassivePaymentsPreviousFormResult } from '../../../Services/mass-payments/Models/massive-payments-previous-form-result';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { NgForm } from '@angular/forms';
import { FavoritePaymentsConfigService } from '../../../Services/mass-payments/favorite-payments-config.service';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { SalariesComponent } from '../../mass-payments/components/multiple-spreadsheets/salaries/salaries.component';
import { ProvidersComponent } from '../components/favorite-spreadsheets/providers/providers.component';
import { CashComponent } from '../components/favorite-spreadsheets/cash/cash.component';
import { AchComponent } from '../components/favorite-spreadsheets/ach/ach.component';
import { UserService } from '../../../Services/users/user.service';
declare let $: any;

@Component({
  selector: 'app-favorite-payments-settings',
  standalone: false,
  templateUrl: './favorite-payments-settings.component.html',
  styleUrls: ['./favorite-payments-settings.component.css'],
  providers: [FavoritePaymentsConfigService, UtilsService]
})
export class FavoritePaymentsSettingsComponent implements OnInit {
  showTokenForm = false;
  excedeedAmount = false;
  showRemoveFavoriteForm = false;
  scheduleOperation = false;
  showGlossForm = false;
  showFavoriteForm = false;
  isTransactionSuccessful = false;
  validateAmount = false;
  haveErrorsHab = false;
  haveErrorsProv = false;
  accountAvailableBalance!: number;
  selectedFavoriteTransaction!: number;
  itemsPerPageHab = 10;
  itemsPerPageProv = 10;
  itemsPerPageEfe = 10;
  itemsPerPageAch = 10;
  rowsPerPageHab: number[] = [10, 15, 20, 25];
  rowsPerPageProv: number[] = [10, 15, 20, 25];
  rowsPerPageEfe: number[] = [10, 15, 20, 25];
  rowsPerPageAch: number[] = [10, 15, 20, 25];
  spreadsheetSizeHab!: number;
  spreadsheetSizeProv!: number;
  spreadsheetSizeEfe!: number;
  spreadsheetSizeAch!: number;
  processBatchNumber!: number;
  globalGloss!: string;
  isVisibleHab!: boolean;
  isVisibleProv!: boolean;
  isVisibleEfe!: boolean;
  isVisibleAch!: boolean;
  isValidSpreadSheet: boolean;
  existsChanges: boolean;
  warningMessagesTitle = 'Configuración Pagos Favoritos ';
  successfulTransactionMessage = Constants.successfulTransactionMessage;
  accountDto!: AccountDto;
  spreadsheetPerPageHab!: FavoritePaymentsSpreadsheetsResult[];
  spreadsheetPerPageProv!: FavoritePaymentsSpreadsheetsResult[];
  spreadsheetPerPageEfe!: FavoritePaymentsSpreadsheetsResult[];
  spreadsheetPerPageAch!: FavoritePaymentsSpreadsheetsResult[];
  spreadsheetDeleteHAB: FavoritePaymentsSpreadsheetsResult[] = [];
  spreadsheetDeletePROV: FavoritePaymentsSpreadsheetsResult[] = [];
  spreadsheetDeleteEFE: FavoritePaymentsSpreadsheetsResult[] = [];
  spreadsheetDeleteACH: FavoritePaymentsSpreadsheetsResult[] = [];
  currentPageHab!: number;
  currentPageProv!: number;
  currentPageEfe!: number;
  currentPageAch!: number;
  batchInformation: FavoritePaymentsData = new FavoritePaymentsData();
  authorizersDto: InputApprovers;
  glossType!: string;
  isValidToCreateBatch!: boolean;
  previousSpreadsheets!: MassivePaymentsPreviousFormResult[];
  @ViewChild(ApproversAndControllersComponent)
  approversComponent!: ApproversAndControllersComponent;
  @ViewChild(SalariesComponent)
  SalariesComponent!: SalariesComponent;
  @ViewChild(ProvidersComponent)
  ProvidersComponent!: ProvidersComponent;
  @ViewChild(CashComponent)
  CashComponent!: CashComponent;
  @ViewChild(AchComponent)
  AchComponent!: AchComponent;
  @ViewChild('globalGlossForm')
  globalGlossForm!: NgForm;
  constructor(private favoriteConfigPaymentService: FavoritePaymentsConfigService, private globalService: GlobalService, private utilsService: UtilsService,
    private cdRef: ChangeDetectorRef, private userService: UserService) {
    this.authorizersDto = {
      operationTypeId: OperationType.formularioSolicitud
    };
    this.batchInformation.operationTypeId = OperationType.formularioSolicitud;
    this.isValidSpreadSheet = false;
    this.existsChanges = false;
    this.batchInformation.currency = 'BOL';
    this.batchInformation.sourceAccount = '11111111111111';
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.getManualSpreadsheets();
    this.validateToCreateBatch();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleAccountChanged($event: AccountResult) {
    this.accountAvailableBalance = $event.availableBalance;
    this.authorizersDto = new InputApprovers({
      operationTypeId: OperationType.pagoFavorito,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      accountNumber: $event.formattedNumber
    });
  }

  validateToCreateBatch() {
    this.favoriteConfigPaymentService.getverifyBatches()
      .subscribe({next: response => this.isValidToCreateBatch = response,
        error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.batchInformation.approvers = $event.approvers;
    this.batchInformation.controllers = $event.controllers;
    this.batchInformation.cismartApprovers = $event.cismartApprovers;
  }

  handlePageChangedHab(pageNumber: number) {
    this.currentPageHab = pageNumber;
    this.spreadsheetPerPageHab = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.operationStatusId !== 8).slice((this.currentPageHab - 1) * this.itemsPerPageHab, this.itemsPerPageHab * this.currentPageHab);
  }

  handlePageChangedProv(pageNumber: number) {
    this.currentPageProv = pageNumber;
    this.spreadsheetPerPageProv = this.batchInformation.spreadsheet.formProvidersPayments.filter(x => x.operationStatusId !== 8).slice((this.currentPageProv - 1) * this.itemsPerPageProv, this.itemsPerPageProv * this.currentPageProv);
  }

  handlePageChangedEfe(pageNumber: number) {
    this.currentPageEfe = pageNumber;
    this.spreadsheetPerPageEfe = this.batchInformation.spreadsheet.formCashPayments.filter(x => x.operationStatusId !== 8).slice((this.currentPageEfe - 1) * this.itemsPerPageEfe, this.itemsPerPageEfe * this.currentPageEfe);
  }

  handlePageChangedAch(pageNumber: number) {
    this.currentPageAch = pageNumber;
    this.spreadsheetPerPageAch = this.batchInformation.spreadsheet.formAchPayments.filter(x => x.operationStatusId !== 8).slice((this.currentPageAch - 1) * this.itemsPerPageAch, this.itemsPerPageAch * this.currentPageAch);
  }

  getManualSpreadsheets() {
    this.favoriteConfigPaymentService.getManualSpreadsheets(new MassivePaymentsSpreadsheetsDto())
      .subscribe({next: spreadsheet => { this.updateSpreadsheet(spreadsheet); this.existsChanges = false; },
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateBatchAmount(): void {
    const amountHAB = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.operationStatusId !== 8));
    this.haveErrorsHab = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.isError).length > 0 ? true : false;
    const amountPROV = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formProvidersPayments.filter(x => x.operationStatusId !== 8));
    this.haveErrorsProv = this.batchInformation.spreadsheet.formProvidersPayments.filter(x => x.isError).length > 0 ? true : false;
    const amountEFE = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formCashPayments.filter(x => x.operationStatusId !== 8));
    const amountACH = this.utilsService.sumTotal(this.batchInformation.spreadsheet.formAchPayments.filter(x => x.operationStatusId !== 8));
    this.batchInformation.amount = amountHAB + amountPROV + amountEFE + amountACH;
    if (this.batchInformation.amount <= 0) {
      this.validateAmount = true;
    } else {
      this.validateAmount = false;
    }
  }

  handleSelectSpreadsheetId($event: MassivePaymentsPreviousFormResult) {
    this.favoriteConfigPaymentService.getSpreadsheet(new MassivePaymentsSpreadsheetsDto({ id: $event.id }))
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  handleGroupChanged($event: number) {
    if ($event === 0) {
      this.getManualSpreadsheets();
    }
  }

  handleViewRowsHab($event: string) {
    this.itemsPerPageHab = +$event;
    this.handlePageChangedHab(0);
  }

  handleViewRowsProv($event: string) {
    this.itemsPerPageProv = +$event;
    this.handlePageChangedProv(0);
  }

  handleViewRowsEfe($event: string) {
    this.itemsPerPageEfe = +$event;
    this.handlePageChangedEfe(0);
  }

  handleViewRowsAch($event: string) {
    this.itemsPerPageAch = +$event;
    this.handlePageChangedAch(0);
  }

  handleAssignGlobalGloss() {
    this.globalService.validateAllFormFields(this.globalGlossForm.form);
    if (this.globalGlossForm.valid) {
      if (this.glossType === 'HAB') {
        this.batchInformation.spreadsheet.formSalariesPayments.forEach(x => x.glossPayment = this.globalGloss);
        this.batchInformation.spreadsheet.formSalariesPayments.forEach(x => x.operationStatusId = 1);
        this.existsChanges = true;
      }
      if (this.glossType === 'PROV') {
        this.batchInformation.spreadsheet.formProvidersPayments.forEach(x => x.glossPayment = this.globalGloss);
        this.batchInformation.spreadsheet.formProvidersPayments.forEach(x => x.operationStatusId = 1);
        this.existsChanges = true;
      }
      this.showGlossForm = false;
      this.globalGloss = undefined!;
    }
  }

  handleLoadFile($event: FormData) {
    this.favoriteConfigPaymentService.getSpreadsheetFromFile($event)
      .subscribe({next: spreadsheet => this.updateSpreadsheet(spreadsheet),
      error: _err => this.globalService.warning(this.warningMessagesTitle, _err.message)});
  }

  updateSpreadsheet(spreadsheet: FavoritePaymentsSpreadsheetsResult[]) {
    for (let i = 0; i < spreadsheet.length; i++) {
      if (spreadsheet.filter(x => x.code === spreadsheet[i].code).length > 1) {
        if (spreadsheet[i].isError) {
          spreadsheet[i].errorMessages = spreadsheet[i].errorMessages.concat('Código Duplicado <br>');
        } else {
          spreadsheet[i].isError = true;
          spreadsheet[i].errorMessages = 'Código Duplicado <br>';
        }
      } else {
        if (spreadsheet[i].errorMessages !== null && spreadsheet[i].errorMessages !== undefined) {
          if (spreadsheet[i].errorMessages.search('Código Duplicado <br>') !== -1) {
            spreadsheet[i].isError = false;
            spreadsheet[i].errorMessages = '';
          }
        }
      }
      if (spreadsheet[i].operationStatusId === 1 || spreadsheet[i].operationStatusId === 8) {
        this.existsChanges = true;
      }
    }
    this.batchInformation.spreadsheet.formSalariesPayments = spreadsheet.filter(x => x.paymentType === 'HAB');
    this.batchInformation.spreadsheet.formProvidersPayments = spreadsheet.filter(x => x.paymentType === 'PROV');
    this.batchInformation.spreadsheet.formCashPayments = spreadsheet.filter(x => x.paymentType === 'EFE');
    this.batchInformation.spreadsheet.formAchPayments = spreadsheet.filter(x => x.paymentType === 'ACH');
    this.updateBatchAmount();
    this.spreadsheetSizeHab = this.batchInformation.spreadsheet.formSalariesPayments.filter(x => x.operationStatusId !== 8).length;
    this.spreadsheetSizeProv = this.batchInformation.spreadsheet.formProvidersPayments.filter(x => x.operationStatusId !== 8).length;
    this.spreadsheetSizeEfe = this.batchInformation.spreadsheet.formCashPayments.filter(x => x.operationStatusId !== 8).length;
    this.spreadsheetSizeAch = this.batchInformation.spreadsheet.formAchPayments.filter(x => x.operationStatusId !== 8).length;
    this.isVisibleHab = this.spreadsheetSizeHab > 0 ? true : false;
    this.isVisibleProv = this.spreadsheetSizeProv > 0 ? true : false;
    this.isVisibleEfe = this.spreadsheetSizeEfe > 0 ? true : false;
    this.isVisibleAch = this.spreadsheetSizeAch > 0 ? true : false;
    this.handlePageChangedHab(this.currentPageHab);
    this.handlePageChangedProv(this.currentPageProv);
    this.handlePageChangedEfe(this.currentPageEfe);
    this.handlePageChangedAch(this.currentPageAch);
    if (spreadsheet.filter(x => x.isError && x.operationStatusId !== 8).length === 0) {
      this.isValidSpreadSheet = true;
    } else {
      this.isValidSpreadSheet = false;
    }
  }

  handleValidate(approversValidation: boolean) {
    if (approversValidation && this.isValidSpreadSheet) {
      this.validateAmounts();
    }
  }

  handleRowChanged() {
    this.updateSpreadsheet(this.batchInformation.spreadsheet.formSalariesPayments.concat(this.batchInformation.spreadsheet.formProvidersPayments)
      .concat(this.batchInformation.spreadsheet.formCashPayments).concat(this.batchInformation.spreadsheet.formAchPayments));
  }

  validateAmounts() {
    if (this.utilsService.validateAmount(this.batchInformation.sourceCurrency, this.accountAvailableBalance, this.batchInformation.currency, this.batchInformation.amount)) {
      this.excedeedAmount = true;
    } else if (this.batchInformation.amount > 0) {
      this.showToken();
    } else {
      this.validateAmount = true;
    }
  }

  showToken() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res) {
          this.showTokenForm = true;
        }
      }});
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.batchInformation.tokenCode = $event.code;
    this.batchInformation.tokenName = $event.name;
    this.favoriteConfigPaymentService.save(this.batchInformation)
      .subscribe({next: response => {
        this.isTransactionSuccessful = true;
        this.processBatchNumber = response.processBatchId;
        this.globalService.info('Operación realizada', this.successfulTransactionMessage + ' ' + this.processBatchNumber + '.', true);
        this.showTokenForm = false;
      }, error: _err => this.globalService.danger(this.warningMessagesTitle, _err.message)});
  }

}
