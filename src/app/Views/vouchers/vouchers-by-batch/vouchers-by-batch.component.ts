import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { VouchersByBatchService } from '../../../Services/vouchers-by-batch/vouchers-by-batch.service';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { FilterDto } from '../../../Services/vouchers-by-batch/models/filter-dto';
import { GetBatchResult } from '../../../Services/vouchers-by-batch/models/get-batch-result';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { UtilsService } from '../../../Services/shared/utils.service';
import { MonthsResult } from '../../../Services/parameters/models/months-result';
import moment, { Moment } from 'moment';
import { OperationTypesResult } from '../../../Services/vouchers-by-batch/models/operation-types-result';
import { AccountResult } from '../../../Services/accounts/models/account-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { Roles } from '../../../Services/shared/enums/roles';
import { UserService } from '../../../Services/users/user.service';
//import { CurrentUser } from 'src/app/Services/users/models/current-user';

@Component({
  selector: 'app-vouchers-by-batch',
  standalone: false,
  templateUrl: './vouchers-by-batch.component.html',
  styleUrls: ['./vouchers-by-batch.component.css'],
  providers: [VouchersByBatchService, UtilsService, AccountsService]
})
export class VouchersByBatchComponent implements OnInit {

  dateRange?: DateRangeModel = new DateRangeModel();
  flag = true;
  totalItems = 0;
  pageItems = 25;
  rowsPerPage: number[] = [10, 15, 20, 25];
  vouchers: GetBatchResult[] = [];
  voucherslist: GetBatchResult[] = [];
  voucherDto: FilterDto = new FilterDto();
  operationTypeResult: OperationTypesResult[] = [];
  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false
  };
  filterType = 0;
  showTable = false;
  today!: Date;
  lastYear!: Date;
  message!: string;
  batchIdInput!: string;
  operationSelected = 0;
  accounts: AccountResult[] = [];
  accountRequest: AccountDto = new AccountDto();
  accountNumber = '';
  isSearch = false;
  isVisibleEBS = false;
  ebsNumber!: string;
  isVisibleDet = false;

  constructor(private vouchersByBatchService: VouchersByBatchService, private accountService: AccountsService,
    private globalService: GlobalService, private utilsService: UtilsService,
    private paramService: ParametersService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.today = new Date();
    this.lastYear = moment(new Date()).add(-365, 'd').toDate();
    this.voucherDto.dateEnd = this.voucherDto.dateInit = new Date();
    this.dateRange!.dateEnd = this.dateRange!.dateInit = this.today;
    this.handelGetOperationTypes();
    this.handleGetAccounts();
  }

  handleGetAccounts() {
    this.accountRequest.currencies = ['USD', 'BOL'];
    this.accountRequest.types = [String.fromCharCode(AccountTypes.passive)];
    this.accountRequest.roleId = Roles.initiator;
    this.accountService.getCompanyAccounts(this.accountRequest)
      .subscribe({next: (response: AccountResult[]) => {
        this.accounts = response;
      }});
  }

  handelGetOperationTypes() {
    this.vouchersByBatchService.getOperationTypeList()
      .subscribe({next: (response: OperationTypesResult[]) => {
        this.operationTypeResult = response;
      }, error: _err => {
        this.globalService.info('Tipo de Operación: ', _err.message);
      }});
  }

  handleGroupChanged($event: any) {
    this.filterType = $event;
    this.isSearch = false;
    this.vouchers = [];
    this.totalItems = 0;
  }

  changeDate() {
    this.IsValid();
  }

  IsValid(): boolean {
    this.flag = false;
    if (this.dateRange!.dateEnd! >= this.lastYear && this.dateRange!.dateInit! >= this.lastYear) {
      if ((this.dateRange!.dateEnd!.getTime() - this.dateRange!.dateInit!.getTime()) / 1000000 < 2678) {
        this.flag = true;
      } else {
        this.flag = false;
        this.message = 'Advertencia. El rango de fechas no puede sobrepasar los 31 días. ';
      }
    } else {
      this.flag = false;
      this.message = 'Advertencia. La búsqueda no puede ser mayor a 365 días a partir de la fecha actual. ';
    }
    return this.flag;
  }

  handleSearch() {
    this.isSearch = false;
    this.voucherDto.accountNumber = this.accountNumber;
    this.showTable = false;
    if (this.flag || this.filterType === 1) {
      if (this.filterType === 0) {
        this.voucherDto.dateInit! = this.dateRange!.dateInit!;
        this.voucherDto.dateEnd! = this.dateRange!.dateEnd!;
      } else {
        this.voucherDto.dateInit = moment(this.voucherDto.dateInit).startOf('month').toDate();
        this.voucherDto.dateEnd = moment(this.voucherDto.dateEnd).endOf('month').toDate();
      }
      this.voucherDto.batchId = this.batchIdInput === undefined! || this.batchIdInput === '' ? null! : this.batchIdInput;
      this.voucherDto.ebsNumber = this.ebsNumber === undefined! || this.ebsNumber === '' ? null! : this.ebsNumber;
      this.voucherDto.operationTypeId = this.operationSelected;
      this.voucherDto.rowIni = -1;
      this.voucherDto.numberRow = 25;
      this.getVouchers(this.voucherDto);
    }
  }

  getVouchers(dto: FilterDto) {
    this.paramService.getValidateCompanyId()
      .subscribe({next: (resp: any) => {
        if (resp.body) {
          const user: any = this.userService.getUserToken();
          for (let item of user.role) {
            if (item.includes('AUTORIZADOR')) {
              this.isVisibleDet = true;
            }
          }
        }
        this.vouchersByBatchService.getVoucherList(dto)
          .subscribe({next: (response: GetBatchResult[]) => {
            this.vouchers = response;
            this.voucherslist = this.vouchers;
            this.totalItems = response.length > 0 ? this.vouchers[0].totalItems : 0;
            this.isVisibleEBS = this.totalItems > 0 ? this.vouchers[0].isVisibleEBSNumber : false;
            this.isSearch = true;

            for (let det of this.voucherslist) {
              if (det.operationTypeId == 8) {
                det.isVisibleButton = this.isVisibleDet;
              }
            }
          }, error: _err => {
            this.globalService.info('Comprobante por lote: ', _err.message);
            this.isSearch = false;
          }});

      }, error: _err => this.globalService.danger('Parametros', _err.message)});
  }

  getReportVoucher(detail: GetBatchResult) {
    this.vouchersByBatchService.getReportVouchers(detail)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport(detail.nameOperation + '.pdf', resp);
      }, error: _err => this.globalService.info('No se pudo descargar su comprobante: ', 'Por favor intente mas tarde.')});
  }

  handleMonthYear($event: MonthsResult) {
    this.voucherDto.dateInit = moment($event.monthYear + '-01').toDate();
    this.voucherDto.dateEnd = moment($event.monthYear + '-01').toDate();
  }

  handleVouchersByOperation($event: any) {}

  handleChangePagination($event: any) {
    this.voucherDto.numberRow = this.pageItems;
    if (this.voucherDto.rowIni !== -1) {
      this.voucherDto.rowIni = ($event - 1) * this.pageItems;
        this.getVouchers(this.voucherDto);
    } else {
      this.voucherDto.rowIni = $event;
      this.vouchers = this.voucherslist;
    }
  }

  handleViewRows($event: any) {
    this.pageItems = +$event;
  }

}
