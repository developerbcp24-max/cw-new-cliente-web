import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Roles } from '../../../Services/shared/enums/roles';
import { MonthsResult } from '../../../Services/parameters/models/months-result';
import { AccountResult } from '../../../Services/accounts/models/account-result';
import { AccountPartialModel } from '../../../Services/historical-accounts/models/AccountPartialModel';
import { DateRangeModel } from '../../shared/cw-components/date-range/date-range.component';
import moment from 'moment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoDialogComponent } from '../components/info-dialog/info-dialog.component';
import { RequestDto } from '../../../Services/api-info-enrequecida/models/RequestDto';
import { ApiInfoReport, Data, Transaction } from '../../../Services/api-info-enrequecida/models/ApiInfoEnrequecida';
import { RequestApiInfReport } from '../../../Services/accounts/models/RequestApiInfReport';
import { ReqApiInfReport } from '../../../Services/accounts/models/ReqApiInfReport';
import { ErrorDetailResult } from '../../../Services/mass-payments/Models/error-detail-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { RequestTransaction } from '../../../Services/api-info-enrequecida/models/RequestTransaction';
import { MovementDepositAbonoResponseModel } from '../../../Services/api-info-enrequecida/models/MovementDepositAbonoResponseModel';
import { ApiInfoEnrequecidaService } from '../../../Services/api-info-enrequecida/api-info-enrequecida.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { UserService } from '../../../Services/users/user.service';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { ResponseData } from '../../../Services/api-info-enrequecida/models/ResponseData';

@Component({
  selector: 'app-api-info-enrquecida',
  standalone: false,
  templateUrl: './api-info-enrquecida.component.html',
  styleUrls: ['./api-info-enrquecida.component.css'],
})
export class ApiInfoEnrquecidaComponent implements OnInit {
  headers = {
    Col01: true,
    Col02: true,
    Col03: true,
    Col04: true,
    Col05: true,
    Col06: true,
    Col07: true,
    Col08: true,
    Col09: true,
    Col10: true,
  }!;

  public request: RequestDto = new RequestDto();
  public transactions: Transaction = new Transaction();
  public responseDto: Transaction[] = [];
  public typeFilter: number;
  public FormatSelected!: string;
    public Type!: string;
    public DateNow!: Date;
    public date!: string;
    public CodeServ!: string;

    public _data: Data = new Data();
    public Company?: string;
    public _accountNumber?: string;
    public Description?: string;
    public Amount?: string;
    public Currency?: string;
    public RegistrationAmount?: string;
    endingBalance: any;

  loading = false;

  responseData: Transaction[] = [];

  swElem!: boolean;
  swMonth!: boolean;
  stringMonth!: string;
  swAccounts!: boolean;
  filtApiInfo: RequestApiInfReport = new RequestApiInfReport();
  pageSize = 10;
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  reportType: ReqApiInfReport = new ReqApiInfReport();
  datereturn = '';
  errors: ErrorDetailResult = new ErrorDetailResult();

  formattedAccount!: string;
  isVisibleList = false;

  dateRange: DateRangeModel = new DateRangeModel();
  sourceAccountRequest: AccountDto = new AccountDto();
  responseDateRes: Transaction[] = [];
  allResponseData: Transaction[] = [];
  currentPage = 1;
  types: string[] = ['P'];
  type: string = '';
  now!: Date;
  filterApi: RequestApiInfReport = new RequestApiInfReport();
  accountSourceDetail: AccountPartialModel = new AccountPartialModel();

  dialogRef!: MatDialogRef<InfoDialogComponent>;
  numberMonths: number = 0;
  isVisible = false;
  public requestTransaction: RequestTransaction = new RequestTransaction();
  public responseTransaction: MovementDepositAbonoResponseModel =
    new MovementDepositAbonoResponseModel();
  private lastRequestTransaction?: RequestTransaction;
  private lastResponseTransaction?: MovementDepositAbonoResponseModel;
  user: any;
  constructor(
    private cdRef: ChangeDetectorRef,
    private _apiInfoenrequecidaservice: ApiInfoEnrequecidaService,
    private utilsService: UtilsService,
    private messageService: GlobalService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.typeFilter = 1;
  }

  ngOnInit(): void {
    this.userService.getValidateCurrentUser();
    this.FormatSelected = 'xls';
    this.now = new Date();
    setInterval(() => {
      this.now = new Date();
    }, 1000);
    this.sourceAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      operationTypeId: [OperationType.consultarCuentas],
      types: this.types,
    });
    this.user = this.userService.getUserToken();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  handleSourceAccountChanged($event: AccountResult) {
    this.request.accountNumber = $event.number;
    this.formattedAccount = $event.formattedNumber;
    this.accountSourceDetail = $event;
    this.type = $event.application;
  }

  openDialog() {
    this.dialog.open(InfoDialogComponent, {
      position: {
        top: '50px',
      },
      width: '30%',
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  handleGroupChanged($event: any) {
    this.typeFilter = $event;
    this.cleanTable();
  }
  cleanTable() {
    this.swElem = false;
    this.swMonth = false;
    this.swAccounts = false;
  }
  handleMonthYear($event: MonthsResult) {
    this.cleanTable();
    this.filtApiInfo.dateInitial = $event.monthYear + '-01';
    this.filtApiInfo.dateEnd = $event.monthYear + '-01';
  }

  showDetail() {
    this.setNewRow();
    this.swMonth = false;
    this.swElem = false;
    if (this.dateRange.isValid || this.typeFilter === 0) {
      if (this.typeFilter === 1) {
        this.filtApiInfo.dateInitial = moment(this.dateRange.dateInit).format(
          'YYYYMMDD'
        );
        this.filtApiInfo.dateEnd = moment(this.dateRange.dateEnd).format(
          'YYYYMMDD'
        );
      } else {
        this.filtApiInfo.dateInitial = moment(this.filtApiInfo.dateInitial)
          .startOf('month')
          .format('YYYYMM');
        this.filtApiInfo.dateEnd = moment(this.filtApiInfo.dateEnd)
          .endOf('month')
          .format('YYYYMM');
      }
      this.loading = true;
      this.request.accountNumber = this.formattedAccount.split('-').join('');
      if (this.type === 'CTE' || this.type === 'AHO') {
        this.request.accountType = this.type;
      } else {
        let err =
          'Su cuenta no es Cuenta corriente, tampoco es una cuenta de ahorro';
        this.messageService.info(err, '');
      }
      let dates = moment(this.dateRange.dateInit).format('YYYYMMDD');
      let hours = moment(this.dateRange.dateInit).format('HH:mm:ss');
      this.request.channelDate = dates;
      this.request.channelHour = hours;
      this.request.employeeFlag = 'S';
      this.request.informationLevel = 'BASICO';
      if (this.filtApiInfo.dateInitial === this.filtApiInfo.dateEnd) {
        this.request.period = this.filtApiInfo.dateInitial;
      }
      this.request.transactionType = 'MOVI';
      this._apiInfoenrequecidaservice.getListApiInfo(this.request).subscribe({
        next: (resp: ResponseData) => {
          const data = resp.data;
          this.Currency = data.currency;
          this.endingBalance = data.endingBalance;
          this.Description = data.statusDescription;
          this._accountNumber = data.accountNumber;
          this.allResponseData = data!.transactions! || [];
          this.handlePageChanged(1);
          if (this.responseData.length > 0) {
            this.isVisibleList = true;
          } else {
            this.isVisibleList = false;
            this.messageService.info('No Existe la Data', '');
          }
        },
        error: (_err) => this.messageService.info(_err.message, ''),
      });
      this.loading = false;
    }
  }

  identificationGo() {
    this.router.navigate(['/queries/identification-deposits']);
  }
  setNewRow(): void {
    this.allResponseData = [];
    this.responseData = [];
    this.isVisibleList = false;
  }
  export($event?: Transaction[], _apiReport?: ApiInfoReport) {
    this.Type = this.FormatSelected;
    this.reportType.reportType = this.Type;
    for (let rep of this.allResponseData) {
      rep.TypeReport = this.FormatSelected;
      rep.Currency = this.Currency;
      rep.statusDescription = this.Description;
      rep.accountNumber = this._accountNumber;
      rep.endingBalance = this.endingBalance;
    }
    this._apiInfoenrequecidaservice
      .getReportsApiInfo(this.allResponseData)
      .subscribe({
        next: (resp: Blob) => {
          if (this.Type === 'xls') {
            this.utilsService.donwloadReport(
              'Reporte de InfoEnrequecida.xls',
              resp
            );
          }
          if (this.Type === 'sap') {
            this.utilsService.donwloadReport(
              'CON' + this.getDate2Str(this.DateNow) + 'G.PRN',
              resp
            );
          }
          if (this.Type === 'sap-D') {
            this.utilsService.donwloadReport(
              'CON' + this.getDate2Str(this.DateNow) + 'D.PRN',
              resp
            );
          }
          if (this.Type === 'pdf') {
            this.utilsService.donwloadReport(
              'Reporte de InfoEnrequecida.pdf',
              resp
            );
          }
        },
        error: (_err) => console.error('Fallo del Servicio: ', _err.message),
      });
  }

  getDate2Str(fecha: Date): string {
    if (fecha != null) {
      let returnDate = '';
      let diaSt = '';
      let mesSt = '';
      let today = new Date();
      today = fecha;
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear().toString();
      if (dd < 10) {
        diaSt = `0${dd}`;
      } else {
        diaSt = `${dd}`;
      }
      if (mm < 10) {
        mesSt = `0${mm}`;
      } else {
        mesSt = `${mm}`;
      }
      returnDate = yyyy + mesSt + diaSt;
      this.datereturn = returnDate;
      return returnDate;
    }
    return this.datereturn;
  }
  handlePageChanged($event: number) {
    this.currentPage = $event;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.responseData = this.allResponseData.slice(start, end);
    this.isVisibleList = this.responseData.length > 0;
  }
  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(1);
  }
  handleOpenModalAbono(item: any) {
    this.loading = true;
    Object.assign(this.responseTransaction, {
      accountNumber: this.request.accountNumber,
      accountType: this.request.accountType,
      ...item,
    });
    this.responseTransaction.destCurrency = this.getCurrencyByAccountNumber();
    this.isVisible = true;
    this.loading = false;
  }
  getCurrencyByAccountNumber(): string {
    const account = this.request.accountNumber;
    if (account && account.length >= 3) {
      const antepenultimo = account.charAt(account.length - 3);
      if (antepenultimo === '2') {
        return 'DOLARES';
      } else if (antepenultimo === '3') {
        return 'BOLIVIANOS';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  handleCloseModalAbono(){
    this.isVisible = false;
  }
  parseDateString(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 8) return null;
    const year = +dateStr.substring(0, 4);
    const month = +dateStr.substring(4, 6) - 1;
    const day = +dateStr.substring(6, 8);
    return new Date(year, month, day);
  }
  getReporteAbono(item: any) {
    this.loading = true;
    Object.assign(this.requestTransaction, {
      accountNumber: this.request.accountNumber,
      accountType: this.request.accountType,
      ...item,
    });
    this.responseTransaction.destCurrency = this.getCurrencyByAccountNumber();
    this._apiInfoenrequecidaservice.getReportTransaction(this.requestTransaction)
    .subscribe({
      next: (resp: Blob) => {
        if (resp.size === 0) {
          this.messageService.info("No se pudo generar el reporte en este momento.", '');
        } else {
          if(this.requestTransaction.amount > 0){
            this.utilsService.donwloadReport(
              'Reporte abono' + this.request.accountNumber + '.pdf',
              resp
            );
          }else{
            this.utilsService.donwloadReport(
              'Reporte retiro' + this.request.accountNumber + '.pdf',
              resp
            );
          }
        }
        this.loading = false;
      },
      error: (_err) => {
        this.messageService.info("No se pudo generar el reporte en este momento.", '');
        this.loading = false;
      }
    });
  }
}
