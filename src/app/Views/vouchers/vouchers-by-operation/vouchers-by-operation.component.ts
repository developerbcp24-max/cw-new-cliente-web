import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { VouchersByOperationService } from '../../../Services/vouchers-by-operation/vouchers-by-operation.service';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { VoucherDto } from '../../../Services/vouchers-by-operation/models/voucher-dto';
import { VoucherResult } from '../../../Services/vouchers-by-operation/models/voucher-result';
import moment, { Moment } from 'moment';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { NgForm } from '@angular/forms';
import { MonthsResult } from '../../../Services/parameters/models/months-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-vouchers-by-operation',
  standalone: false,
  templateUrl: './vouchers-by-operation.component.html',
  styleUrls: ['./vouchers-by-operation.component.css'],
  providers: [VouchersByOperationService, AccountsService]
})
export class VouchersByOperationComponent implements OnInit {

  dateRange?: DateRangeModel = new DateRangeModel();
  voucherDto: VoucherDto = new VoucherDto();
  vouchers: VoucherResult[] = [];
  resultVouchers: VoucherResult[] = [];
  today!: Date;
  lastYear!: Date;
  operationIdInput!: string;
  batchIdInput!: number;
  providerInput!: string;
  swTable!: boolean;
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 25;
  totalItems = 0;
  flag = true;
  message!: string;
  typeFilter = 0;
  accountNumber = '';
  isVisibleDet = false;

  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false
  };

  @ViewChild('filterForm')
  filterForm!: NgForm;
  accountRequest: AccountDto = new AccountDto();
  accounts: AccountResult[] = [];
  titularUser: any;

  constructor(private vouchersByOperationService: VouchersByOperationService, private accountService: AccountsService,
    private globalService: GlobalService, private cdRef: ChangeDetectorRef,
    private paramService: ParametersService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.today = new Date();
    this.lastYear = moment(new Date()).add(-365, 'd').toDate();
    this.voucherDto.EndDate = this.voucherDto.InitialDate = new Date();
    this.dateRange!.dateEnd = this.dateRange!.dateInit = this.today;
    this.batchIdInput = null!;
    this.swTable = false;
    this.operationIdInput = '';
    this.providerInput = '';
    this.accountRequest.currencies = ['USD', 'BOL'];
    this.accountRequest.types = [String.fromCharCode(AccountTypes.passive)];
    this.accountRequest.roleId = Roles.initiator;
    this.accountService.getCompanyAccounts(this.accountRequest)
      .subscribe({next: (response: AccountResult[]) => {
        this.accounts = response;
      }});
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  changeDate() {
    this.IsValid();
  }

  handleSearch() {
    this.voucherDto.accountNumber = this.accountNumber;
    this.pageItems = 25;
    if (this.flag || this.typeFilter === 1) {
      if (this.typeFilter === 0) {
        this.voucherDto.InitialDate = this.dateRange!.dateInit!;
        this.voucherDto.EndDate = this.dateRange!.dateEnd!;
      } else {
        this.voucherDto.InitialDate = moment(this.voucherDto.InitialDate).startOf('month').toDate();
        this.voucherDto.EndDate = moment(this.voucherDto.EndDate).endOf('month').toDate();
      }
      this.voucherDto.BatchId = this.batchIdInput === null || this.batchIdInput === undefined || this.batchIdInput.toString() === '' ? 0 : this.batchIdInput;
      this.voucherDto.OperationId = this.operationIdInput;
      this.voucherDto.Provider = this.providerInput;
      this.voucherDto.rowIni = -1;
      this.voucherDto.numberRow = 25;
      this.getVouchers(this.voucherDto);
    }
  }

  getVouchers(dto: VoucherDto) {
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

    this.vouchersByOperationService.getVouchers(dto)
      .subscribe({next: (response: VoucherResult[]) => {
        this.vouchers = response;
        this.resultVouchers = this.vouchers;
        this.totalItems = response.length > 0 ? this.vouchers[0].totalItems : 0;
        this.swTable = true;

        for (let det of this.resultVouchers) {
          if (det.operationTypeId == 8) {
            det.isVisibleButton = this.isVisibleDet;
          }
        }
      }, error: _err => {
        this.globalService.info('Comprobante por operación: ', _err.message);
        this.swTable = false;
      }});
    }, error: _err => this.globalService.danger('Parametros', _err.message)});
  }

  handleClear() {
    this.operationIdInput = '';
    this.batchIdInput = null!;
    this.providerInput = '';
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

  handleMonthYear($event: MonthsResult) {
    this.voucherDto.InitialDate = moment($event.monthYear + '-01').toDate();
    this.voucherDto.EndDate = moment($event.monthYear + '-01').toDate();
  }

  handleChangedDate() {
    this.typeFilter = Number(this.typeFilter);
    this.handleGroupChanged(this.typeFilter);
  }

  handleGroupChanged($event: any) {
    this.typeFilter = $event;
    this.swTable = false;
    this.vouchers = [];
  }

  handleChangePagination($event: number) {
    this.voucherDto.numberRow = this.pageItems;
    if (this.voucherDto.rowIni !== -1) {
      this.voucherDto.rowIni = ($event - 1) * this.pageItems;
        this.getVouchers(this.voucherDto);
    } else {
      this.voucherDto.rowIni = $event;
      this.vouchers = this.resultVouchers;
    }
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
  }
}
