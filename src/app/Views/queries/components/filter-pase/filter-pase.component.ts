import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConsultorsPaseService } from '../../../../Services/pase/consultors-pase.service';
import { RequestModelPaseAccount } from '../../../../Services/pase/Models/Request-model-pase';
import { ResponseModelPaseAccount } from '../../../../Services/pase/Models/response-model-pase';
import { Router } from '@angular/router';
import { RequestModelPaseDetail } from '../../../../Services/pase/Models/Request-model-pase';
import { RequestModelHeadPase } from '../../../../Services/pase/Models/Request-model-pase';
import { ResponseModelDate } from '../../../../Services/pase/Models/response-model-date';
import { UserService } from '../../../../Services/users/user.service';
import { ResponseModelPaseHead } from '../../../../Services/pase/Models/ResponseModelPaseHead';
import { MonthsResult } from '../../../../Services/parameters/models/months-result';
import { HistoricalBasic } from '../../../../Services/historical-accounts/models/historical-basic';
import moment, { Moment } from 'moment';
import { DateRangeModel, OptionsDateRange } from '../../../../Views/shared/cw-components/date-range/date-range.component';


@Component({
  selector: 'app-filter-pase',
  standalone: false,
  templateUrl: './filter-pase.component.html',
  styleUrls: ['./filter-pase.component.css'],
  providers: [ConsultorsPaseService]
})

export class FilterPaseComponent implements OnInit {
  public typeFilter: number;
  public val1 = true;
  public val2 = false;
  private selectedLink!: string;
  public AcountSelected!: ResponseModelPaseAccount;
  public MonthSelected: ResponseModelDate = new ResponseModelDate();
  ResponseModelDate!: ResponseModelDate[];
  public ok!: boolean;
  dateRange: DateRangeModel = new DateRangeModel();
  filterDto: HistoricalBasic = new HistoricalBasic();
  public RequestModelPaseDetail: RequestModelPaseDetail = new RequestModelPaseDetail();
  public RequestModelHeadPase: RequestModelHeadPase = new RequestModelHeadPase();
  public DateIniHeadStr: string = "";
  public DateEndHeadStr: string = "";

  swElem!: boolean;
  swMonth!: boolean;
  stringMonth!: string;
  swAccounts!: boolean;
  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    maxMonthRange: 3,
    isMaxDateNow: true,
    showClearDate: false
  };

  loading = false;
  public modelDate: Date = new Date();
  public Interval = 0;
  public Month = 3;
  public NameCompany!: string;
  public RequestModelPaseAccount: RequestModelPaseAccount = new RequestModelPaseAccount();
  public ResponseModelAccount: ResponseModelPaseAccount[] = [];
  public ResponseModelPaseHead: ResponseModelPaseHead[] = [];
  currentUser: any;
  constructor(private _ConsultorsPaseService: ConsultorsPaseService,
    private _router: Router,
    private userService: UserService, private cdRef: ChangeDetectorRef) {
    this.typeFilter = 0;
  }

  ngOnInit() {
    this.currentUser = this.userService.getUserToken();
    this.NameCompany = this.currentUser.company_name;
    this.getMonth();
    this.RequestModelPaseAccount.ClientId = this.currentUser.nameid;
    this.RequestModelPaseAccount.OperationId = 12;
    this.RequestModelPaseAccount.RoleId = '2';
    this.getListAccount(this.RequestModelPaseAccount);
    this.typeFilter = 0;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getMonth() {
    this._ConsultorsPaseService
      .getMonth()
      .subscribe({next: (resp: ResponseModelDate[]) => {
        this.ResponseModelDate = resp;
        this.MonthSelected = this.ResponseModelDate[0];
      },
      error: _err => console.error('El servicio no esta disponible ', _err.message)});
  }

  ShowDetail() {
    this.swMonth = false;
    this.swElem = false;
    if (this.dateRange.isValid || this.typeFilter === 1) {
      if (this.typeFilter === 0) {
        this.filterDto.dateInitial = this.dateRange.dateInit
          ? moment(this.dateRange.dateInit).format('YYYYMMDD')
          : '';
        this.filterDto.dateEnd = this.dateRange.dateEnd
          ? moment(this.dateRange.dateEnd).format('YYYYMMDD')
          : '';
      } else {
        this.filterDto.dateInitial = moment(this.filterDto.dateInitial).startOf('month').format('YYYYMMDD');
        this.filterDto.dateEnd = moment(this.filterDto.dateEnd).endOf('month').format('YYYYMMDD');
      }
      if (this.typeFilter === 0) {
        this.Interval = (Date.UTC(this.dateRange.dateEnd!.getFullYear(), this.dateRange.dateEnd!.getMonth() + 1, this.dateRange.dateEnd!.getDate()) - Date.UTC(this.dateRange.dateInit!.getFullYear(), this.dateRange.dateInit!.getMonth() + 1, this.dateRange.dateInit!.getDate())) / 86400000;
        this.Interval = Math.round(this.Interval / 30);
      } else {
        this.Interval = 0;
      }
      this.loading = true;
      this.RequestModelHeadPase = {
        'CodeService': this.AcountSelected.numberAccount,
        'DatesInicial': this.filterDto.dateInitial,
        'DatesEnd': this.filterDto.dateEnd
      };
      this._ConsultorsPaseService
        .getDetailHeadPase(this.RequestModelHeadPase)
        .subscribe({next: (resp: ResponseModelPaseHead[]) => {
          this.ResponseModelPaseHead = resp;
          if (this.ResponseModelPaseHead.length > 0) {
            this._router.navigate(['queries/detail-pase'], { queryParams: { DateIniHeadStr: this.filterDto.dateInitial, DateEndHeadStr: this.filterDto.dateEnd, numberAccount: this.AcountSelected.numberAccount }, skipLocationChange: true });
          } else {
            this.swElem = true;
          }
        }, error: _err => console.log('Mensaje de Alerta: ', _err.message)});
      this.loading = false;
    }
  }

  getListAccount(RequestModelPaseAccount: RequestModelPaseAccount) {
    this.swAccounts = false;
    this._ConsultorsPaseService
      .getAccountRoles(RequestModelPaseAccount)
      .subscribe({next: (resp: ResponseModelPaseAccount[]) => {
        this.ResponseModelAccount = resp;


        if (this.ResponseModelAccount.length > 0) {
          this.AcountSelected = this.ResponseModelAccount[0]
        } else {
          this.swAccounts = true;
        }
      }, error: _err => console.error('El servicio no esta disponible para obtener cuenta', _err.message)});
  }

  handleMonthYear($event: MonthsResult) {
    this.cleanTable();
    this.filterDto.dateInitial = $event.monthYear + '-01';
    this.filterDto.dateEnd = $event.monthYear + '-01';
  }

  handleGroupChanged($event: any) {
    this.typeFilter = $event;
    this.cleanTable();
  }

  changeAccount() {
    this.cleanTable();
  }

  cleanTable() {
    this.swElem = false;
    this.swMonth = false;
    this.swAccounts = false;
  }
}
