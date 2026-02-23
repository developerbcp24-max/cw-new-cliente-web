import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CreditCardsService } from '../../../../Services/credit-cards/credit-cards.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from '../../../../Services/shared/global.service';
import { CreditCardsAccountByIdDto } from '../../../../Services/credit-cards/models/credit-cards-by-id-dto';
import { CreditCardsMovementsDto } from '../../../../Services/credit-cards/models/credit-cards-movements-dto';
import { CreditCardsMovementsResult } from '../../../../Services/credit-cards/models/credit-cards-movements-result';
import { CreditCardsAccountResult } from '../../../../Services/credit-cards/models/credit-cards-account-result';
import { MonthsResult } from '../../../../Services/parameters/models/months-result';
import { UtilsService } from '../../../../Services/shared/utils.service';


@Component({
  selector: 'app-search-credit-cards-movements-per-month',
  standalone: false,
  templateUrl: './search-credit-cards-movements-per-month.component.html',
  styleUrls: ['./search-credit-cards-movements-per-month.component.css'],
  providers: [CreditCardsService, UtilsService]
})
export class SearchCreditCardsMovementsPerMonthComponent implements OnInit {
  months: any;
  @Input()
  request!: CreditCardsAccountByIdDto;
  account: any;
  requestmovements: CreditCardsMovementsDto = new CreditCardsMovementsDto();
  totalCredit!: number;
  totalDebit!: number;
  url: any;
  movements: CreditCardsMovementsResult[] = [];
  show!: boolean;
  isVisible!: boolean;
  isVisibleComp!: boolean;
  file!: File;
  exportFile!: FileReader;
  numberOfMonths: number;
  monthName!: string;
  isVisibleComponents: boolean;
  numberOfRows: number;
  currentPage = 0;
  allSelected = false;
  movementsToControl: CreditCardsMovementsResult[] = [];
  pageItems = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  totalMovements!: number;

  tableFlag: boolean;

  constructor(private creditCardsService: CreditCardsService, private domSanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef, private utilsService: UtilsService) {
    this.numberOfMonths = 4;
    this.isVisibleComponents = false;
    this.numberOfRows = 5;
    this.tableFlag = false;
  }
  ngOnInit() {
    this.creditCardsService
      .getAccountsCreditCardsById(this.request)
      .subscribe({next: (resp: CreditCardsAccountResult) => {
        this.account = resp;
        this.requestmovements.userName = this.account.userName;
        this.requestmovements.currentBalance = this.account.availableBalance;
        this.requestmovements.numberAccount = this.account.accountNumber;
        this.requestmovements.accountCardNumber = this.account.accountNumber;
        this.requestmovements.typeAccountCard = this.account.typeAccount;
        this.requestmovements.estateAccountCard = this.account.estateAccount;
        this.requestmovements.currency = this.account.currency;
        this.requestmovements.availableBalance = this.account.availableBalance;
      }, error: _err => console.error('Servicio de cuentas no disponible: ', _err.message)});
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleGetMonths($event: MonthsResult) {
    this.requestmovements.initialDate = $event.initial;
    this.requestmovements.initialDateSample = $event.initial;
    this.requestmovements.endDate = $event.final;
    this.requestmovements.endDataSample = $event.final;
    this.monthName = $event.description;
    this.isVisibleComponents = true;
  }

  handlePageChanged($event: any) {
    this.allSelected = false;
    this.movements = this.movementsToControl.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }
  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
  getMovements() {
    this.tableFlag = false;
    this.creditCardsService.getMovementsCreditCards(this.requestmovements)
      .subscribe({next: (resp: CreditCardsMovementsResult[]) => {
        if (resp.length > 2) {
          this.totalMovements = resp.length;
          this.movementsToControl = resp;
          this.totalDebit = resp[0].totalDebit;
          this.totalCredit = resp[0].totalCredit;
          this.isVisible = true;
          this.isVisibleComp = false;
        } else {
          this.totalDebit = resp[0].totalDebit;
          this.totalCredit = resp[0].totalCredit;
          this.isVisible = false;
          this.isVisibleComp = true;
          this.tableFlag = true;
        }
      }, error: _err => {
        console.error('Fallo del Servicio: ', _err.message);
        this.tableFlag = true;
      }})
  }
  getReport() {
    this.creditCardsService.getReportMovements(this.requestmovements)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('Reporte de Tarjetas de Crédito.pdf', resp);
      }, error: _err => console.error('Fallo del Servicio: ', _err.message)});
  }
  handleChanges() {
    this.isVisible = false;
    this.isVisibleComp = false;
  }
}
