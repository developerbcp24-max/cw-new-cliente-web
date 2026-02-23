import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../Services/shared/global.service';
import { OperationReceivedDto } from '../../../Services/transfers-abroad/models/operation-received-dto';
import { OperationReceivedResult } from '../../../Services/transfers-abroad/models/operation-received-result';
import { TransferAbroadSwiftDto } from '../../../Services/transfers-abroad/models/transfer-abroad-swift-dto';
import { TransferAbroadSwiftListResult, TransferAbroadSwiftResult } from '../../../Services/transfers-abroad/models/transfer-abroad-swift-result';
import { TransfersAbroadService } from '../../../Services/transfers-abroad/transfer-abroad.service';
import moment, { Moment } from 'moment';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-swift',
  standalone: false,
  templateUrl: './swift.component.html',
  styleUrls: ['./swift.component.css'],
  providers: [TransfersAbroadService]
})
export class SwiftComponent implements OnInit {

  dateRange: DateRangeModel = new DateRangeModel();
  transferAbroadSwiftDto: TransferAbroadSwiftDto = new TransferAbroadSwiftDto();
  operationReceivedDto: OperationReceivedDto = new OperationReceivedDto();
  swifts: TransferAbroadSwiftListResult = new TransferAbroadSwiftListResult();
  received: OperationReceivedResult[] = [];
  receivedPage: OperationReceivedResult[] = [];
  filterType = 'send';
  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    maxMonthRange: 3,
    showClearDate: false
  };

  pageReceivedSize = 10;
  pageItems = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  resultSwift: TransferAbroadSwiftResult[] = [];
  isVisibleError = false;

  constructor(private transfersAbroadService: TransfersAbroadService, private userService: UserService) {
    this.dateRange.dateInit = moment(new Date()).add(-3, 'M').toDate();
    this.dateRange.dateEnd = new Date();
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
  }

  handleSearch() {
    this.resetLists();
    const { transferAbroadSwiftDto, dateRange, transfersAbroadService } = this;
    if (this.filterType === 'send') {
      transferAbroadSwiftDto.currentPage = 0;
      transferAbroadSwiftDto.totalItems = 0;
      this.listSwift();
    } else {
      this.listReceived();
    }
  }

  handleChangePagination($event: number) {
    this.transferAbroadSwiftDto.currentPage = $event;
    this.listSwift();
  }

  handleViewRowsSent($event: string) {
    this.pageItems = +$event;
    this.handleChangePagination(0);
  }

  listSwift() {
    this.isVisibleError = false;
    const { transferAbroadSwiftDto, dateRange, transfersAbroadService } = this;
    transferAbroadSwiftDto.init = dateRange.dateInit!;
    transferAbroadSwiftDto.end = dateRange.dateEnd!;
    transferAbroadSwiftDto.pageSize = this.pageItems;
    transfersAbroadService.getTransfersSwift(transferAbroadSwiftDto)
      .subscribe({next: (res: TransferAbroadSwiftListResult) => {
        this.swifts = res;
        transferAbroadSwiftDto.currentPage = res.currentPage;
        transferAbroadSwiftDto.totalItems = res.totalItems;
        this.isVisibleError = res.totalItems === 0 ? true : false;
      }, error: _err => {
        this.isVisibleError = true;
      }});
  }

  listReceived() {
    this.isVisibleError = false;
    const { operationReceivedDto, dateRange, transfersAbroadService } = this;
    operationReceivedDto.init = dateRange.dateInit!;
    operationReceivedDto.end = dateRange.dateEnd!;
    transfersAbroadService.getOperationsReceived(operationReceivedDto)
      .subscribe({next: (res: OperationReceivedResult[]) => {
        this.received = res;
        this.isVisibleError = this.received.length === 0 ? true : false;
      }, error: _err => {
        this.isVisibleError = true;
      }});
  }

  handleChangeFilter($event: string) {
    this.filterType = $event;
    this.isVisibleError = false;
    this.resetLists();
  }

  resetLists() {
    this.swifts = new TransferAbroadSwiftListResult();
    this.received = [];
  }

  handleChangePaginationReceived($event: number) {
    this.receivedPage = this.received.slice((($event - 1) * this.pageReceivedSize), this.pageReceivedSize * $event);
  }

  handleViewRowsReceived($event: string) {
    this.pageReceivedSize = +$event;
    this.handleChangePaginationReceived(0);
  }
}

