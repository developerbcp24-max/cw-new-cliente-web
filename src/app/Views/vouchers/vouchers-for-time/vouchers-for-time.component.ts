import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { VoucherOperationService } from '../../../Services/vouchers/voucher-operation/voucher-operation.service';
import { VoucherResult } from '../../../Services/vouchers/voucher-operation/models/voucher-result';
import { FilterDto } from '../../../Services/vouchers/voucher-operation/models/filter-dto';
import { VoucherDto } from '../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../Services/shared/global.service';
import moment, { Moment } from 'moment';
import { ActivatedRoute } from '@angular/router';
import { TypeOperation } from '../../../Services/vouchers/voucher-operation/models/type-operation';
import { UserService } from '../../../Services/users/user.service';
import { DateRangeModel } from '../../shared/cw-components/date-range/date-range.component';

@Component({
  selector: 'app-vouchers-for-time',
  standalone: false,
  templateUrl: './vouchers-for-time.component.html',
  styleUrls: ['./vouchers-for-time.component.css'],
  providers: [VoucherOperationService]
})
export class VouchersForTimeComponent implements OnInit {

  dateRange: DateRangeModel = new DateRangeModel();
  pageItems = 10;
  totalVouchers = 0;
  listDetailVoucher: VoucherResult[] = [];
  resultVoucher: VoucherResult[] = [];
  resultVoucherTotal: VoucherResult[] = [];
  listVoucherPaginator: VoucherResult[] = [];
  requestDto: VoucherDto = new VoucherDto();

  filterDto: FilterDto = new FilterDto();
  @Output() listVoucherChecked = new EventEmitter();
  @Output() voucherChecked = new EventEmitter();
  countChecked!: number;
  voucherCheckedList: VoucherDto[] = [];
  isPanelVisible: boolean;
  message!: string;
  rowsPerPage: number[] = [10, 15, 20, 25];
  initDate: any;
  endDate!: string;
  inputValue = 0;
  isVisibleError = false;
  operations: TypeOperation[] = [];
  arrayOperationType = [9, 32, 33, 34];
  batchId!: string[];
  isVisibleEBS = false;
  isVisibleDet = false;

  constructor(private voucherOperationService: VoucherOperationService, private messageService: GlobalService,
    private cdRef: ChangeDetectorRef, private route: ActivatedRoute,
    private paramService: ParametersService, private userService: UserService) {
    this.isPanelVisible = false;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    const pathVoucher = this.route.snapshot.url[0].path;
    if (pathVoucher == 'current') {
      this.filterDto.month = this.inputValue = 0;
      this.initDate = moment(new Date()).subtract('months').startOf('month');
    }
    else if (pathVoucher == 'aMonthAgo') {
      this.filterDto.month = this.inputValue = 1;
      this.initDate = moment(new Date()).subtract(this.inputValue, 'months').startOf('month');
      this.endDate = moment().subtract(this.inputValue, 'months').endOf('month').format('YYYY-MM-DD');
    }
    else if (pathVoucher == 'twoMonthsAgo') {
      this.filterDto.month = this.inputValue = 2;
      this.initDate = moment(new Date()).subtract(this.inputValue, 'months').startOf('month');
      this.endDate = moment().subtract(this.inputValue, 'months').endOf('month').format('YYYY-MM-DD');
    }
    else if (pathVoucher == 'threeMonthsAgo') {
      this.filterDto.month = this.inputValue = 3;
      this.initDate = moment(new Date()).subtract(this.inputValue, 'months').startOf('month');
      this.endDate = moment().subtract(this.inputValue, 'months').endOf('month').format('YYYY-MM-DD');
    }
    else if (pathVoucher == 'aYearAgo') {
      this.filterDto.month = this.inputValue = -1;
      this.initDate = moment(new Date()).add('years', -1);
    }
    this.filterDto.dateInit = moment(this.initDate).toDate();
    this.filterDto.dateEnd = moment(this.endDate).toDate();
    this.filterDto.rowIni = -1;
    this.filterDto.numberRow = 10;
    this.handleListVoucher(this.filterDto);

    this.getTypeOperation();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getTypeOperation() {
    this.voucherOperationService.GetListTypeOperation()
      .subscribe({
        next: (response: TypeOperation[]) => {
          this.operations = response;
        }
      });
  }

  handleListVoucher(filterDto: FilterDto) {
    this.isVisibleError = this.isVisibleDet = false;
    this.paramService.getValidateCompanyId()

      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            const user: any = this.userService.getUserToken();
            for (let item of user.role) {
              if (item.includes('AUTORIZADOR')) {
                this.isVisibleDet = true;
              }
            }
          }

          this.voucherOperationService.GetListVoucher(filterDto)
            .subscribe({
              next: (response: VoucherResult[]) => {
                this.listDetailVoucher = response;
                this.resultVoucher = this.listDetailVoucher;
                this.totalVouchers = this.listDetailVoucher.length > 0 ? this.listDetailVoucher[0].totalItems : 0;
                this.isVisibleEBS = this.totalVouchers > 0 ? this.listDetailVoucher[0].isVisibleEBSNumber : false;
                if (this.totalVouchers === 0) {
                  this.isVisibleError = true;
                } else {
                  for (let det of this.listDetailVoucher) {
                    if (det.operationTypeId == 8) {
                      det.isVisibleButton = this.isVisibleDet;
                      let g = det.isVisibleButton;
                    }
                  }
                }
              }, error: _err => this.messageService.info('No se pudo cargar sus registros: ', ' Por favor intente mas tarde.')

            });
        }, error: _err => this.messageService.danger('Parametros', _err.message)
      });
  }

  handleVoucherChanged($event: FilterDto) {
    this.isVisibleError = false;
    this.filterDto.isFilter = true;
    for (let i = 0; i < this.voucherCheckedList.length; i++) {
      this.voucherCheckedList.pop();
    }
    this.voucherCheckedList.pop();
    this.filterDto = $event;
    this.filterDto.operationTypeId = this.filterDto.operationTypeId === undefined ? 0 : this.filterDto.operationTypeId;
    this.filterDto.rowIni = -1;
    this.filterDto.numberRow = 10;
    this.handleListVoucher(this.filterDto);
  }

  handleListChecked($event: any) {
    this.voucherCheckedList = $event;
  }

  handleBatchesToControlPageChanged($event: number) {
    for (let i = 0; i < this.voucherCheckedList.length; i++) {
      this.voucherCheckedList.pop();
    }
    this.filterDto.numberRow = this.pageItems;
    if (this.filterDto.rowIni !== -1) {
      this.filterDto.rowIni = ($event - 1) * this.pageItems;
      this.handleListVoucher(this.filterDto);
    } else {
      this.filterDto.rowIni = $event;
      this.listDetailVoucher = this.resultVoucher;
    }
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
  }
}
