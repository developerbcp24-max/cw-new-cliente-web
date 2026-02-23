import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { TypeOperation } from '../../../../Services/vouchers/voucher-operation/models/type-operation';
import { FilterDto } from '../../../../Services/vouchers/voucher-operation/models/filter-dto';
import { SelectedVoucher } from '../../../../Services/vouchers/voucher-operation/models/selected-voucher';
import { VoucherDto } from '../../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { OldVouchersService } from '../../../../Services/vouchers/old-vouchers/old-vouchers.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import moment, { Moment } from 'moment';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { DateRangeModel, OptionsDateRange } from '../../../shared/cw-components/date-range/date-range.component';

@Component({
  selector: 'app-filter-old-vouchers',
  standalone: false,
  templateUrl: './filter-old-vouchers.component.html',
  styleUrls: ['./filter-old-vouchers.component.css'],
  providers: [OldVouchersService]
})
export class FilterOldVouchersComponent implements OnInit {

  @Output() onChange = new EventEmitter<TypeOperation>();
  @Output() onChangeFilter = new EventEmitter<FilterDto>();
  @Input() returnOperations = false;
  @Input() companyAccounts = false;
  @Input() selectedOperations = 0;
  @Input() loadFirstOperation = true;
  @Input() defaultOperation = 0;
  @Input() isAwait = false;
  @Input() inputValue!: number;
  @Input() operations!: TypeOperation[];

  @Input() filterDto: FilterDto = new FilterDto();

  @Input() voucherCheckedList!: SelectedVoucher[] | any[];
  requestDto: VoucherDto = new VoucherDto();
  selectedVoucher: SelectedVoucher = new SelectedVoucher();
  numberLot!: string;
  lotInput!: string;
  operationSelected!: number;
  idSelected!: number;
  currentDate: Date;
  formatDate!: string;
  isVisible = false;
  dateRange: DateRangeModel = new DateRangeModel();
  countChecked = 0;

  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false
  };

  constructor(private oldVouchersService: OldVouchersService,
    private messageService: GlobalService,
    private cdRef: ChangeDetectorRef,
    private utilsService: UtilsService) {
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.operationSelected = 0;
    this.dateRange.dateInit = this.filterDto.dateInit;
    this.dateRange.dateEnd = this.filterDto.dateEnd;
    this.changeDate(this.dateRange.dateInit, this.dateRange.dateEnd);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  changeDate(dateInit: any, dateEnd: any) {
    const validDateInit = moment(dateInit).add(-1, 'days').format('YYYY-MM-DD');
    const validDateEnd = moment(dateEnd).add(1, 'days').format('YYYY-MM-DD');
    this.optionsDateRange.minDate = moment(validDateInit).toDate();
    this.optionsDateRange.maxDate = moment(validDateEnd).toDate();
  }

  handleTypeOperationChanged() {
    this.idSelected = this.operationSelected;
  }
  handleCaptureLotInput() {
    this.numberLot = this.lotInput;
  }

  handleSearch() {
    this.filterDto.id = parseInt(this.numberLot);
    this.numberLot = this.numberLot === undefined ? '' : this.numberLot;
    if (!isNaN(this.filterDto.id)) {
      this.filterDto.arrayId = this.numberLot.split(',');
    } else if (this.numberLot !== '') {
      this.filterDto.id = 1;
      this.filterDto.arrayId = ['00', '00'];
    }
    this.filterDto.operationTypeId = this.idSelected;
    this.filterDto.dateInit = this.dateRange.dateInit!;
    this.filterDto.dateEnd = this.dateRange.dateEnd!;
    this.onChangeFilter.emit(this.filterDto);
  }

  handleDownloadReport() {
    this.countChecked = 0;
    this.requestDto.arrayVoucher = [];
    this.formatDate = this.currentDate.getDate().toString() + '-' + (this.currentDate.getMonth() + 1).toString() + '-' + this.currentDate.getFullYear().toString();
  }

  handleCleanSearch() {
    window.location.reload();
  }
}
