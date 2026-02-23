import { Component, OnInit } from '@angular/core';
import { MovAccountsDto } from '../../../Services/historical-accounts/models/MovAccountsDto';
import { HistoricalAccountsService } from '../../../Services/historical-accounts/historical-accounts.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { NumberRowModel } from '../../../Services/historical-accounts/models/NumberRowModel';
import { HistoricalBasic } from '../../../Services/historical-accounts/models/historical-basic';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { MonthsResult } from '../../../Services/parameters/models/months-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { HistoricalAccountsResult } from '../../../Services/historical-accounts/models/HistoricalAccountsResult';
import moment from 'moment';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { AccountResult } from '../../../Services/accounts/models/account-result';
import { MovAccountsModel } from '../../../Services/historical-accounts/models/MovAccountsModel';
import { AccountPartialModel } from '../../../Services/historical-accounts/models/AccountPartialModel';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-historical-accounts',
  standalone: false,
  templateUrl: './historical-accounts.component.html',
  styleUrls: ['./historical-accounts.component.css'],
  providers: [HistoricalAccountsService]
})
export class HistoricalAccountsComponent implements OnInit {

  typeFilter: number;
  miModel: MovAccountsDto = new MovAccountsDto();
  filterDto: HistoricalBasic = new HistoricalBasic();
  dateRange: DateRangeModel = new DateRangeModel();
  selectedMonth: MonthsResult = new MonthsResult();

  vector: MovAccountsModel[] = [];
  vectorListAccountMovement: MovAccountsModel[] = [];

  sourceAccountRequest: AccountDto = new AccountDto();
  types: string[] = ['P'];

  resultHistorical: HistoricalAccountsResult = new HistoricalAccountsResult();
  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    maxMonthRange: 12,
    showClearDate: false
  };

  isVisibleList = false;
  flagHistTr = false;
  formattedAccount!: string;
  isVisibleError = false;
  valueGlobal = false;
  accountSourceDetail: AccountPartialModel = new AccountPartialModel();
  isVisibleCertificate = false;
  totalItems!: number;
  changeCount = 0;

  constructor(private _HistoricalAccountsService: HistoricalAccountsService, private messageService: GlobalService, private userService: UserService) {
    this.typeFilter = 0;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.filterDto.dateEnd = this.filterDto.dateInitial = moment(new Date()).add(-1, 'day').toString();
    this.dateRange.dateEnd = this.dateRange.dateInit = moment(new Date()).add(-1, 'day').toDate();
    this.sourceAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      operationTypeId: [OperationType.consultarCuentas],
      types: this.types
    });
  }

  handleSourceAccountChanged($event: AccountResult) {
    this.filterDto.numberAccount = $event.number;
    this.formattedAccount = $event.formattedNumber;
    this.accountSourceDetail = $event;
  }

  handleMonthYear($event: MonthsResult) {
    this.filterDto.dateInitial = this.filterDto.dateEnd = $event.monthYear + '-01';
  }

  handleChangedDate() {
    this.typeFilter = Number(this.typeFilter);
    this.handleGroupChanged(this.typeFilter);
  }

  handleGroupChanged($event: any) {
    this.filterDto = new HistoricalBasic();
    this.typeFilter = $event;
    this.isVisibleList = this.isVisibleError = false;
    this.resultHistorical.tableBody = [];
  }

  handleChangePaginate(request: MovAccountsDto) {
    this.miModel = request;
    this.handGetHistoricalAccount();
  }

  handleReportH() {
    if (this.typeFilter === 1 || this.dateRange.isValid) {
      if (this.typeFilter === 0) {
        this.filterDto.dateInitial = moment(this.dateRange.dateInit).format('YYYY-MM-DD');
        this.filterDto.dateEnd = moment(this.dateRange.dateEnd).format('YYYY-MM-DD');
      } else {
        this.filterDto.dateInitial = moment(this.filterDto.dateInitial).startOf('month').format('YYYY-MM-DD');
        this.filterDto.dateEnd = moment(this.filterDto.dateEnd).endOf('month').format('YYYY-MM-DD');
      }
      this.miModel.NumberRow = 0;
      this.isVisibleList = this.isVisibleError = false;
      this.filterDto.numberAccount = this.accountSourceDetail.number;

      this._HistoricalAccountsService.getNumberRowAccounts(this.filterDto)
        .subscribe({next: (response: NumberRowModel) => {
          this.miModel.NumberRow = response.numberRow;
          if (this.miModel.NumberRow > 0) {
            this.totalItems = this.miModel.NumberRow;
            this.miModel.RowIni = -1;
            this.miModel.NumberRow = 25;
            this.handGetHistoricalAccount();
          } else {
            this.isVisibleError = true;
          }
        }, error: _err => {
          this.resultHistorical.tableBody = [];
          this.isVisibleError = true;
        }});
    }
  }

  handGetHistoricalAccount() {
    this.miModel.DateIni = this.filterDto.dateInitial;
    this.miModel.DateEnd = this.filterDto.dateEnd;
    this.miModel.NumberCta = this.filterDto.numberAccount;
    this.miModel.FormattedAccount = this.formattedAccount;
    this.miModel.OutListType = false;
    this._HistoricalAccountsService.getListHistorical(this.miModel)
      .subscribe({next: response => {
        this.resultHistorical = response;
        this.isVisibleList = true;
        this.flagHistTr = response.flagHistTr;
        this.vectorListAccountMovement = response.tableBody;
      }, error: _err => this.messageService.info('Historicos.', 'Por favor vuelva a intentarlo mas tarde.')});
  }

  handlePasaParametro($event: MovAccountsModel[]) {
    this.vector = $event;
  }
  handlePasaParametroTwo($event: MovAccountsModel[]) {
    this.vectorListAccountMovement = $event;
  }
  handlevalueGlobal($event: any) {
    this.valueGlobal = $event;
  }
  handleCertificate($event: any) {
    this.isVisibleCertificate = $event;
  }
  handlePressButton($event: any) {

  }
}
