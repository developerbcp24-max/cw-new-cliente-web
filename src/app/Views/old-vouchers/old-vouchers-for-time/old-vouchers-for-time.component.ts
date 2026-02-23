import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment, { Moment } from 'moment';
import { VoucherDto } from '../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { FilterDto } from '../../../Services/vouchers/voucher-operation/models/filter-dto';
import { VoucherResult } from '../../../Services/vouchers/voucher-operation/models/voucher-result';
import { TypeOperation } from '../../../Services/vouchers/voucher-operation/models/type-operation';
import { GlobalService } from '../../../Services/shared/global.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { OldVouchersService } from '../../../Services/vouchers/old-vouchers/old-vouchers.service';

@Component({
  selector: 'app-old-vouchers-for-time',
  standalone: false,
  templateUrl: './old-vouchers-for-time.component.html',
  styleUrls: ['./old-vouchers-for-time.component.css'],
  providers: [OldVouchersService, UtilsService]
})
export class OldVouchersForTimeComponent implements OnInit {

  voucherCheckedList: VoucherDto[] = [];
  initDate: any;
  endDate!: string;
  inputValue: number = 0;
  filterDto: FilterDto = new FilterDto();
  operations: TypeOperation[] = [];
  pathVoucher!: string;
  isVisibleError: boolean = false;
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems: number = 10;
  totalVouchers = 0;
  listDetailVoucher: VoucherResult[] = [];
  resultVoucher: VoucherResult[] = [];
  resultVoucherTotal: VoucherResult[] = [];
  listVoucherPaginator: VoucherResult[] = [];

  constructor(private oldVouchersService: OldVouchersService, private messageService: GlobalService,
    private cdRef: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.pathVoucher = this.route.snapshot.url[0].path;
    switch (this.pathVoucher) {
      case 'oldCurrent':
        this.filterDto.month = this.inputValue = 0;
        this.initDate = moment(new Date()).subtract(1, 'months').startOf('month');
        break;
      case 'oldAMonthAgo':
        this.filterDto.month = this.inputValue = 1;
        this.initDate = moment(new Date()).subtract(this.inputValue, 'months').startOf('month');
        this.endDate = moment().subtract(this.inputValue, 'months').endOf('month').format('YYYY-MM-DD');
        break;
      case 'oldTwoMonthsAgo':
        this.filterDto.month = this.inputValue = 2;
        this.initDate = moment(new Date()).subtract(this.inputValue, 'months').startOf('month');
        this.endDate = moment().subtract(this.inputValue, 'months').endOf('month').format('YYYY-MM-DD');
        break;
      case 'oldThreeMonthsAgo':
        this.filterDto.month = this.inputValue = 3;
        this.initDate = moment(new Date()).subtract(this.inputValue, 'months').startOf('month');
        this.endDate = moment().subtract(this.inputValue, 'months').endOf('month').format('YYYY-MM-DD');
        break;
      case 'oldAYearAgo':
        this.filterDto.month = this.inputValue = -1;
        this.initDate = moment(new Date()).subtract(-1, 'years');
        break;
    }
    this.filterDto.dateInit = moment(this.initDate).toDate();
    this.filterDto.dateEnd = moment(this.endDate).toDate();
    this.handleListVoucher(this.filterDto);
    this.getTypeOperation(this.filterDto);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getTypeOperation(filterDto: FilterDto) {
    this.oldVouchersService.getOldTypeOperation(filterDto)
      .subscribe({next: (response: TypeOperation[]) => {
        for (let item of response) {
          this.operations.push({id : item.id,
            nameTypeOperation : item.nameTypeOperation,
            operationTypeDes: item.operationTypeDes});
        }
      }, error: _err => this.messageService.info('Tipo de Operación: ', _err.message)});
  }

  handleVoucherChanged($event: FilterDto) {
    this.isVisibleError = false;
    for (let _item of this.voucherCheckedList) {
      this.voucherCheckedList.pop();
    }

    this.resultVoucher = this.resultVoucherTotal;
    this.totalVouchers = this.resultVoucher.length;

    this.filterDto.id = $event.id;
    this.filterDto.operationTypeDes = $event.operationTypeId === undefined ? undefined! : $event.operationTypeId.toString();
    this.filterDto.arrayId = $event.arrayId;
    this.filterDto.dateInit = $event.dateInit;
    this.filterDto.dateEnd = $event.dateEnd;
  }

  handleListVoucher(filterDto: FilterDto) {
    this.isVisibleError = false;
    this.oldVouchersService.getListOldVoucher(filterDto)
      .subscribe({next: (response: VoucherResult[]) => {
        this.listDetailVoucher = response;
        this.resultVoucher = this.listDetailVoucher;
        this.resultVoucherTotal = this.listDetailVoucher;
        this.totalVouchers = response.length;
        if (this.totalVouchers === 0) {
          this.isVisibleError = true;
        }
      }, error: _err => this.messageService.info('Comprobantes: ', _err.message)});
  }

  handleListChecked($event: any) {
    this.voucherCheckedList = $event;
  }

  handleBatchesToControlPageChanged($event: number) {
    for (let _item of this.voucherCheckedList) {
      this.voucherCheckedList.pop();
    }
    this.listDetailVoucher = this.resultVoucher.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handleBatchesToControlPageChanged(0);
  }
}
