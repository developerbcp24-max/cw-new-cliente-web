import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { GetBranchListRequest } from '../../../../app/Services/qr/models/GetBranchListRequest';
import { ReportQRCopabolRequest } from '../../../Services/qr/models/ReportQRCopabolRequest';
import { RequestQrReport } from '../../../Services/qr/models/RequestQrReport';
import { ListBusinesQR } from '../../../Services/qr/models/ListBusinessQR';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { BranchBO, CurrencyBO, ListBranchQR, ServiceBO } from '../../../Services/qr/models/ListBranchQR';
import { TransaccionDetail } from '../../../Services/qr/models/ReportQRResponse';
import { ReqQRReport } from '../../../Services/qr/models/ReqQRReport';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { BusinesBranchId } from '../../../Services/qr/models/BusinesBranchId';
import { TransaccionDetailRep } from '../../../Services/qr/models/TransactionDetailRep';
import { RegisterService } from '../../../Services/qr/register.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { UserService } from '../../../Services/users/user.service';
import { AppConfig } from '../../../app.config';
import { UtilsService } from '../../../Services/shared/utils.service';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { MonthsResult } from '../../../Services/parameters/models/months-result';

@Component({
  selector: 'app-qr-report-bcp',
  standalone: false,
  templateUrl: './qr-report-bcp.component.html',
  styleUrls: ['./qr-report-bcp.component.css']
})
export class ReporteCopabol implements OnInit {
  public requestBranchs: GetBranchListRequest = new GetBranchListRequest()

  public request: ReportQRCopabolRequest = new ReportQRCopabolRequest()
  public filtQR: RequestQrReport = new RequestQrReport();
  public FormatSelected!: string;
  public Type!: string;
  public Currency?: string;
  public _accountNumber?: string;
  public Description?: string;
  public typeFilter!: number;
  public businessQR: ListBusinesQR[] = [];
  public DateNow: Date = new Date();
  public date!: string;
  public CodeServ!: string;
  //optional
  accounts: AccountResult[] = [];
  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    maxMonthRange: 12,
    showClearDate: false
  };

  listBranchQR!: ListBranchQR[];
  currencyBO: CurrencyBO[] = []
  listBranchCopabol: BranchBO[] = []
  listServiceCopabol: ServiceBO[] = []
  stateCopabol: CurrencyBO[] = []

  swElem!: boolean;
  swMonth!: boolean;
  stringMonth!: string;
  swAccounts!: boolean;
  datereturn = '';
  responseData: TransaccionDetail[] = []
  isVisibleList = false;
  reportType: ReqQRReport = new ReqQRReport();
  isVisibleError = false;
  totalOperaciones = 0;
  currentUser: any;

  dateRange: DateRangeModel = new DateRangeModel();
  loading: boolean = false;
  @Input() accountDto: AccountDto;
  @Input() showBarRoute = true;
  @Input() isOnlyRead = false;
  @Input() disabled = false;
  @Input() showDetails = true;
  @Input() loadFirstAccount = true;
  @Input() isFlagVisible = true;
  idBusinesBranch: BusinesBranchId = new BusinesBranchId();
  accountSelected: AccountResult = new AccountResult();
  respDet:TransaccionDetailRep[] =[];
  DaysQrReport = 7;

  constructor(private cdRef: ChangeDetectorRef,
    private servicesQr: RegisterService,
    private messageService: GlobalService,
    private utilsService: UtilsService, private userService: UserService, private config: AppConfig) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [
        OperationType.pagoHaberes,
        OperationType.pagoProveedores,
        OperationType.pagoProveedoresAch,
        OperationType.pagoQr,
        OperationType.pagoProveedoresEfe,
        OperationType.nationalTransfers,
        OperationType.transAlExteriorConCambioD,
        OperationType.transferenciasCuentasPropias,
        OperationType.transferenciasCuentasTerceros],
      types: [String.fromCharCode(AccountTypes.passive)],
    })

    this.currencyBO = [
      { value: 'BOB', description: 'BOLIVIANOS' },
      { value: 'USD', description: 'DOLARES' }
    ]
    this.stateCopabol = this.config.getConfig('StateQR');
    this.DaysQrReport = this.config.getConfig('DaysQrReport');
  }


  ngOnInit(): void {
    this.userService.getValidateCurrentUser();
    this.currentUser = this.userService.getUserToken();
    this.FormatSelected = 'xls';
    this.request.CompanyId = this.currentUser.company_id
    this.requestBranchs.CompanyId = this.currentUser.company_id
    this.servicesQr.GetBranchList(this.requestBranchs)
          .subscribe({
            next: (resp: any) => {
              if (resp.data.branchs.length > 0){
                this.isVisibleError = false;
                this.listBranchCopabol = resp.data.branchs;
              }
              else{
                this.isVisibleError = true;
              }
            }, error: err => {
              this.isVisibleError = true;
              this.messageService.info(err.message, '');
            }
          });
    this.request.BranchCode = ""
    this.request.ServiceCode = ""
    this.request.Currency = 'BOB';
    this.request.State = 'P';

  }

  onChangeBranch(event: any){
    this.listServiceCopabol = this.listBranchCopabol.find(x => x.value == this.request.BranchCode)!.services;
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  handleAccountChanged(_$event?: any/* AccountResult */) {
  }
  handleShowAdditionForm(): void {
    //not more
  }

  changeEventLogAccount(_event: any) {
    //not more
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
    this.filtQR.dateInitial = $event.monthYear + '-01';
    this.filtQR.dateEnd = $event.monthYear + '-01';
  }

  setNewRow(): void {
    this.responseData = [];
    if (this.responseData.length <= 0) {
      this.isVisibleList = false
    }
  }
  countDays(fecha: Date, dias: number): Date {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  showDetail() {
    this.setNewRow();
    this.request.StartDate = moment(this.dateRange.dateInit).format('YYYYMMDD');
    this.request.FinalDate = moment(this.dateRange.dateEnd).format('YYYYMMDD');
    const tiempoTranscurrido = Date.now();
    const hoy: Date = new Date(tiempoTranscurrido);
    let date = this.countDays(hoy, - this.DaysQrReport);
        this.servicesQr.getReportQrCopabol(this.request)
          .subscribe({
            next: (resp: any) => {
              if (resp.data.details.length > 0){
                this.isVisibleError = false;
                let data = resp.data;
                this.responseData = data.details;
                this.isVisibleList = true;
                this.totalOperaciones = resp.data.details.length
              }
              else{
                this.isVisibleError = true;
              }
            }, error: err => {
              this.isVisibleError = true;
              this.messageService.info(err.message, '');
            }
          });
  }
  isDisabled(): boolean {
    return (this.request.BranchCode != "" && this.request.ServiceCode != "") ? false : true ;
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
      this.datereturn = returnDate
      return returnDate;
    }
    return this.datereturn;
  }
  export(_$event?: TransaccionDetailRep[], _apiReport?: ReqQRReport) {
    this.respDet = this.responseData;
    this.Type = this.FormatSelected;
    this.reportType.reportType = this.Type;
    for (let rep of this.respDet) {
      rep.typeReport = this.FormatSelected;
      rep.DateFecha = moment(rep.transaccionDate).format('DD/MM/YYYY');
      rep.DateHour = moment(rep.transaccionDate).format('HH:mm:ss');
    }
    this.servicesQr
      .getReportsQRPayment(this.respDet)
      .subscribe({
        next: (resp: Blob) => {
          if (this.Type === 'xls') {
            this.utilsService.donwloadReport('Reporte de PagosQR.xls', resp);
          }
          if (this.Type === 'pdf') {
            this.utilsService.donwloadReport('Reporte de PagosQR.pdf', resp);
          }
        }, error: _err => this.messageService.info('Fallo del Servicio: ', _err.message)
      });
  }
}
