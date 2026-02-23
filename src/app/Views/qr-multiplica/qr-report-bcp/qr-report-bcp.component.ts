import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { ReportQRRequest } from '../../../Services/qr/models/ReportQRRequest';
import { RequestQrReport } from '../../../Services/qr/models/RequestQrReport';
import { ListBusinesQR } from '../../../Services/qr/models/ListBusinessQR';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { CurrencyBO, ListBranchQR } from '../../../Services/qr/models/ListBranchQR';
import { TransaccionDetail } from '../../../Services/qr/models/ReportQRResponse';
import { ReqQRReport } from '../../../Services/qr/models/ReqQRReport';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { BusinesBranchId } from '../../../Services/qr/models/BusinesBranchId';
import { TransaccionDetailRep } from '../../../Services/qr/models/TransactionDetailRep';
import { RegisterService } from '../../../Services/qr/register.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { UserService } from '../../../Services/users/user.service';
import { AppConfig } from '../../../app.config';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { MonthsResult } from '../../../Services/parameters/models/months-result';


@Component({
  selector: 'app-qr-report-bcp',
  standalone: false,
  templateUrl: './qr-report-bcp.component.html',
  styleUrls: ['./qr-report-bcp.component.css']
})
export class QrReportBcpComponent implements OnInit {

  public request: ReportQRRequest = new ReportQRRequest()
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

  swElem!: boolean;
  swMonth!: boolean;
  stringMonth!: string;
  swAccounts!: boolean;
  datereturn = '';
  responseData: TransaccionDetail[] = []
  isVisibleList = false;
  reportType: ReqQRReport = new ReqQRReport();

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
  respDet: TransaccionDetailRep[] = [];
  DaysQrReport = 7;

  constructor(private cdRef: ChangeDetectorRef,
    private servicesQr: RegisterService,
    private messageService: GlobalService,
    private utilsService: UtilsService, private userService: UserService,private config: AppConfig) {
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
    ];

    this.DaysQrReport = this.config.getConfig('DaysQrReport');
  }


  ngOnInit(): void {
    this.userService.getValidateCurrentUser();
    this.FormatSelected = 'xls';
    this.request.BranchCode = '';
    this.request.Currency = 'BOB';
    this.getBusiness();
  }
  getBusiness() {
    this.servicesQr.getBusinessQR()
      .subscribe({
        next: (resp: ListBusinesQR[]) => {
          this.businessQR = resp
          for (let k of this.businessQR) {
            this.idBusinesBranch.businessId=k.id;
            this.getBranchQR(this.idBusinesBranch)
            this.request.BusinessCode = k.businessCode;
            this.request.Abbreviation = k.abreviation;
          }

        }, error: _err => {
//not more
        }
      });
  }

  getBranchQR(idBis: BusinesBranchId) {
    this.servicesQr.getBranchesQR(idBis)
      .subscribe({
        next: (resp: any) => {
          this.listBranchQR = resp;
        }, error: _err => {
          //not more
        }
      })
  }

  selectBranchQR() {
    /*This is intentional*/
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  handleAccountChanged(_$event?: any) {
    /*This is intentional*/
  }
  handleShowAdditionForm(): void {/*This is intentional*/ }

  changeEventLogAccount(_event: any) {
/*This is intentional*/
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
    let restDate = moment(date).format('YYYYMMDD');
    if (this.request.StartDate >= restDate) {
      if (this.request.BranchCode !== '') {
        this.servicesQr.getReportQr(this.request)
          .subscribe({
            next: (resp: any) => {
              let data = resp.data;
              this.responseData = data.transaccionDetails;
              this.isVisibleList = true;
            }, error: err => {
              this.messageService.info(err.message, '');
            }
          })
      } else {
        this.messageService.info('Info: ', ' Seleccione un Sucursal');
      }
    }else{
      this.messageService.warning('Alerta!: ', 'El reporte de QR en linea tiene una antiguedad de ' +this.DaysQrReport+ ' días');
    }
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
