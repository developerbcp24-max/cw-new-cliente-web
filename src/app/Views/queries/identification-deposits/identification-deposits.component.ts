import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../Services/accounts/models/account-result';
import { CreditCardsService } from '../../../Services/credit-cards/credit-cards.service';
import { InformationMovementDepositResponseModel } from '../../../Services/movementDeposit/models/information-movement-deposit-response-model';
import { MovementDepositBasicRequestModel } from '../../../Services/movementDeposit/models/movement-deposit-basic-request-model';
import { MovementsDepositsService } from '../../../Services/movementDeposit/movements-deposits.service';
import { MonthsResult } from '../../../Services/parameters/models/months-result';
import { UserService } from '../../../Services/users/user.service';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import moment, { Moment } from 'moment';
import { Router } from '@angular/router';
import { ConfirmationTicket } from '../../../Services/movementDeposit/models/confirmation-ticket';
import { UtilsService } from '../../../Services/shared/utils.service';

@Component({
  selector: 'app-identification-deposits',
  standalone: false,
  templateUrl: './identification-deposits.component.html',
  styleUrls: ['./identification-deposits.component.css'],
  providers: [MovementsDepositsService, AccountsService, CreditCardsService, UserService, UtilsService]
})
export class IdentificationDepositsComponent implements OnInit {

  ok!: boolean;
  public swList = false;
  public currentPage: any;
  private selectedLink: string;
  public FormatSelected!: string;
  public Type!: string;
  selectedItem: any;

  public dateInit: any;
  public dateEnd: any;
  public numPag!: number;
  public numFilPag!: number;
  public numberRowMsg!: string;
  public dateMonthYear!: IMyDateModel;
  public totalItems!: number;
  public destinationAccount!: string;
  headers = {
    col01: true,
    col02: true,
    col03: true,
    col04: true,
    col05: true,
    col06: true,
    col07: true,
    mtoOper: false,
    monOper: false,
    titular: false
  };

  optionsDateRange: OptionsDateRange = {
    isMaxDateNow: true,
    maxMonthRange: 12,
    isHorizontal: false
  };
  dateRange: DateRangeModel = new DateRangeModel();
  informationModel!: InformationMovementDepositResponseModel;
  list: MovementDepositBasicRequestModel[] = [];
  listPages: MovementDepositBasicRequestModel[] = [];
  accounts: AccountResult[] = [];
  accountSelected: AccountResult = new AccountResult();
  typeFilt: number;
  checkMoreDetails = false;
  requestmovements: MovementDepositBasicRequestModel = new MovementDepositBasicRequestModel();
  request: AccountDto = new AccountDto();
  isVisible = false;
  movementDepositSelected: MovementDepositBasicRequestModel = new MovementDepositBasicRequestModel();
  monthSelected: MonthsResult = new MonthsResult();
  pageSelected = 1;
  sizePage = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  user: any;
  swWarning!: boolean;
  confirmation: ConfirmationTicket = new ConfirmationTicket();
  @Input() showModal = false;
  isVisibleConfirmation = false;
  @Input() isVisibleBtn = false;
  nameReport!: 'Reporte de Identifiación de Abonos';

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

  constructor(private movementsDepositsService: MovementsDepositsService, private accountService: AccountsService,
   private userService: UserService, private router: Router, private cdRef: ChangeDetectorRef, private utilsService: UtilsService) {
    this.selectedLink = 'opcMes';
    this.resetDatePicker();
    this.resetMonth();
    this.typeFilt = 0;
    this.swList = false;
  }
  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.swWarning = false;
    this.getConfirmation();
    this.dateRange.dateInit = moment(new Date).add(-1, 'd').toDate();
    this.dateRange.dateEnd = moment(new Date).add(-1, 'd').toDate();
    this.request = new AccountDto(
      {
        accountUse: 'D',
        operationTypeId: [12],
        roleId: 2,
        types: ['P']
      }
    );
    this.user = this.userService.getUserToken();
    this.Type = this.FormatSelected;

    this.accountService.getAccounts(this.request)
      .subscribe({next: response => {
        this.accounts = response;
      }});

    this.informationModel = new InformationMovementDepositResponseModel(
      {
        dateInitial: '',
        dateEnd: '',
        account: '',
        operationTypes: 0,
        numPag: 1,
        quantityData: 1000000,
        type: this.Type
      }
    );
    this.monthSelected.initial = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.monthSelected.final = new Date();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  infoEnreqGo(){
    this.router.navigate(['/queries/api-info-enrquecida']);
  }
  resetDatePicker() {
    this.dateRange.dateInit = moment(new Date()).add(-1, 'd').toDate();
    this.dateRange.dateEnd = moment(new Date()).add(-1, 'd').toDate();
  }
  resetMonth() {
    this.monthSelected.initial = moment(new Date()).toDate();
    this.monthSelected.final = moment(new Date()).toDate();
  }

  handlePageChanged($event: number) {
    this.listPages = this.list.slice((($event - 1) * this.sizePage), this.sizePage * $event);
  }

  handleViewRows($event: string) {
    this.sizePage = +$event;
    this.handlePageChanged(0);
  }
  handleOpenModal(item: any) {
    this.isVisible = true;
    this.movementDepositSelected = item;
  }

  handleCloseModal() {
    this.isVisible = false;
  }

  handleUpdateReport() {
    this.cleanCode();
    if (this.typeFilt === 1 || this.dateRange.isValid) {
      if (this.typeFilt === 0) {
        this.informationModel.dateInitial = this.dateRange.dateInit!;
        this.informationModel.dateEnd = this.dateRange.dateEnd!;
      } else {
        this.informationModel.dateInitial = this.monthSelected.initial;
        this.informationModel.dateEnd = this.monthSelected.final;
      }
      this.movementsDepositsService.getTotalMovement(this.informationModel)
        .subscribe({next: response => {
          this.totalItems = response.total;
          if (this.totalItems === 0 && this.informationModel.account !== '') {
            this.swList = false;
            this.swWarning = true;
          }
        }});

      this.movementsDepositsService
        .getMovements(this.informationModel)
        .subscribe({next: res => {
          this.list = res;
          this.totalItems = res.length;
          this.swList = (this.list.length > 0);
          this.swWarning = (this.list.length === 0);
        }, error: _err => { console.log(_err); }});
    }
  }

  formatDate(date: IMyDateModel) {
    const year = date.date.year.toString();
    const month = date.date.month <= 9 ? '0' + date.date.month : date.date.month.toString();
    const day = date.date.day <= 9 ? '0' + date.date.day : date.date.day.toString();
    return `${year}${month}${day}`;
  }

  getLastDay(yearMonth: string): IMyDateModel {
    const monthyear = yearMonth.split('#');
    const year = +monthyear[1];
    const month = +monthyear[0];
    const date = new Date(year, month - 1, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const result: any = { date: { year: year, month: month, day: lastDay.getDate() } };
    return result;
  }

  setradio(e: number) {
    this.informationModel.operationTypes = e;
    this.cleanCode();
  }

  isSelected(name: string): boolean {
    if (!this.selectedLink) {
      return false;
    }
    return this.selectedLink === name;
  }

  handleGetMonths($event: MonthsResult) {
    const firstDate = new Date($event.monthYear);
    const firstDay = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 1);
    const lastDate = new Date($event.monthYear);
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth() + 2, 0);
    this.monthSelected.initial = firstDay;
    this.monthSelected.final = lastDay;
    this.swWarning = false;
  }
  handleChangedDrpMonth() {
    /*This is intentional*/
  }

  handleAccountChanged($event: any) {
    this.cleanCode();
    this.accountSelected = $event;
    this.informationModel.account = this.accountSelected.number;
    if (this.accountSelected.currency === 'BOL') {
      this.accountSelected.currency = 'BOLIVIANOS';
    } else {
      if (this.accountSelected.currency === 'USD') { this.accountSelected.currency = 'DOLARES'; }
    }
    if (this.accountSelected.application === 'CTE') {
      this.accountSelected.application = 'CUENTA CORRIENTE';
    } else {
      if (this.accountSelected.application === 'AHO') { this.accountSelected.application = 'CUENTA DE AHORRO'; }
    }
  }
  reload() {
    this.router.navigate(['/queries/identification-deposits']);
  }

  getReport() {
    if (this.typeFilt === 0) {
      this.informationModel.dateInitial = this.dateRange.dateInit!;
      this.informationModel.dateEnd = this.dateRange.dateEnd!;
      this.informationModel.type = this.FormatSelected;
    } else {
      this.informationModel.type = this.FormatSelected;
    }

    this.movementsDepositsService.getReportMovements(this.informationModel)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('Reporte Identificación Abonos ' + this.informationModel.account + '.' + this.FormatSelected, resp);
      }, error: _err => console.error('Fallo del Servicio: ', _err.message)});
  }

  getReporte(item: any) {
    this.movementDepositSelected = item;
    this.movementDepositSelected.destinationAccount = this.accountSelected.formattedNumber;
    this.movementsDepositsService.getReportsMovements(this.movementDepositSelected)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('Reporte Identificación Abonos ' + this.informationModel.account + '.pdf', resp);
      }, error: _err => console.error('Fallo del Servicio: ', _err.message)});
  }

  getConfirmation() {
    this.movementsDepositsService.getConfirmationTicket().subscribe({next: res => {
      this.confirmation = res;
      if (this.confirmation.existUser === false) {
        this.isVisibleConfirmation = true;
      } else {
        this.isVisibleConfirmation = false;
      }
    }, error: _err => { console.log(_err); }});
  }

  handleCloseModalConfirmation() {
    this.movementsDepositsService.saveContractConfirmation().subscribe({next: res => {
      this.confirmation = res;
    }, error: _err => { console.log(_err); }});
    this.isVisibleConfirmation = false;
    this.showModal = false;
  }

  handleConfirmation(e: any) {
    if (e.target.checked) {
      this.isVisibleBtn = true;
    } else {
      this.isVisibleBtn = false;
    }
  }

  handleGroupChanged($event: any) {
    this.typeFilt = $event;
    this.cleanCode();
  }

  changeAccount() {
    this.swWarning = false;
  }

  cleanCode() {
    this.swList = false;
    this.swWarning = false;
  }
}
