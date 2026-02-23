import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import moment, { Moment } from 'moment';
import { VoucherOperationService } from '../../../../Services/vouchers/voucher-operation/voucher-operation.service';
import { TypeOperation } from '../../../../Services/vouchers/voucher-operation/models/type-operation';
import { VoucherDto } from '../../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { FilterDto } from '../../../../Services/vouchers/voucher-operation/models/filter-dto';
import { SelectedVoucher } from '../../../../Services/vouchers/voucher-operation/models/selected-voucher';
import { DateRangeModel, OptionsDateRange } from '../../../shared/cw-components/date-range/date-range.component';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-filter-voucher-operation',
  standalone: false,
  templateUrl: './filter-voucher-operation.component.html',
  styleUrls: ['./filter-voucher-operation.component.css'],
  providers: [VoucherOperationService, UtilsService]
})
export class FilterVoucherOperationComponent implements OnInit {

  @Output() onChange = new EventEmitter<TypeOperation>();
  @Output() onChangeFilter = new EventEmitter<FilterDto>();
  @Input() returnOperations = false;
  @Input() companyAccounts = false;
  @Input() selectedOperations = 0;
  @Input() loadFirstOperation = true;
  @Input() defaultOperation = 0;
  @Input() isAwait = false;
  @Input()
  inputValue!: number;
  @Input() operations!: TypeOperation[];

  @Input() filterDto: FilterDto = new FilterDto();

  @Input() voucherCheckedList!: SelectedVoucher[] | any[];
  @Input() prueba: VoucherDto[] =[]
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

  constructor(private voucherOperationService: VoucherOperationService,
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
    this.filterDto.batchId = this.numberLot === undefined! || this.numberLot === '' ? null! : this.numberLot;
    this.filterDto.operationTypeId = this.idSelected;
    this.filterDto.dateInit = this.dateRange.dateInit!;
    this.filterDto.dateEnd = this.dateRange.dateEnd!;
    this.onChangeFilter.emit(this.filterDto);
  }

  handleDownloadReport() {
    this.countChecked = 0;
    this.requestDto.arrayVoucher = [];
    this.formatDate = this.currentDate.getDate().toString() + '-' + (this.currentDate.getMonth() + 1).toString() + '-' + this.currentDate.getFullYear().toString();

    for (let i = 0; i < this.voucherCheckedList.length; i++) {
      this.countChecked = this.countChecked + 1;
    }
    if (this.countChecked > 0) {
      this.requestDto.arrayVoucher = this.voucherCheckedList;
      this.currentDate = new Date();
      this.voucherOperationService.downloadReportZip(this.requestDto)
        .subscribe({next: (resp: Blob) => {
          this.utilsService.donwloadReport('Comprobantes_' + this.formatDate + '.zip', resp);
        }, error: _err => this.messageService.info('No se pudo descargar su comprobante: ', 'Por favor intente mas tarde.')});
    } else {
      this.messageService.info('Nota:', 'No existe ningún registro seleccionado.');
    }
  }

  handleCleanSearch() {
    window.location.reload();
  }
}
