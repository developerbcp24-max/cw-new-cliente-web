import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { VoucherResult } from '../../../../Services/vouchers/voucher-operation/models/voucher-result';
import { VoucherDto } from '../../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { FilterDto } from '../../../../Services/vouchers/voucher-operation/models/filter-dto';
import { SelectedVoucher } from '../../../../Services/vouchers/voucher-operation/models/selected-voucher';
import { UserCreationId } from '../../../../Services/vouchers/voucher-operation/models/user-creation-id';
import { OldVouchersService } from '../../../../Services/vouchers/old-vouchers/old-vouchers.service';
import { UserService } from '../../../../Services/users/user.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-list-old-vouchers',
  standalone: false,
  templateUrl: './list-old-vouchers.component.html',
  styleUrls: ['./list-old-vouchers.component.css'],
  providers: [OldVouchersService]
})
export class ListOldVouchersComponent implements OnInit {

  @Output() voucherChecked = new EventEmitter();
  @Output() listVoucherChecked = new EventEmitter();
  @Output() arrayChecked = new EventEmitter();
  @Input() message!: string;
  @Input() inputValue!: number;
  @Input() listDetailVoucher!: VoucherResult[];

  pageItems = 10;
  totalVouchersAMonthAgo = 0;
  requestDto: VoucherDto = new VoucherDto();
  downloadVoucher = true;
  filterDto: FilterDto = new FilterDto();
  resultVoucher: VoucherResult[] = [];
  resultVoucherTotal: VoucherResult[] = [];
  requestUserId: UserCreationId = new UserCreationId();
  totalVouchers = 0;
  vouchersCheckeds: boolean[] = [];
  vouchersDetailCheckeds: boolean[] = [];
  vouchersFractionatedCheckeds: boolean[] = [];
  vouchersTextCheckeds: boolean[] = [];
  userId!: string;
  arrayVoucher: Array<SelectedVoucher> = [];

  constructor(private oldVouchersService: OldVouchersService, private messageService: GlobalService,
    private userService: UserService, private utilsService: UtilsService, private cdRef: ChangeDetectorRef) {
     }

  ngOnInit() {
    this.arrayVoucher = [];
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.vouchersCheckeds = [];
    this.vouchersDetailCheckeds = [];
    this.vouchersFractionatedCheckeds = [];
    this.vouchersTextCheckeds = [];
  }

  verificationUser(detail: any, _typeVoucher: number) {
    const user = this.userService.getUserToken();
    detail.userId = user.nameid.toString();
  }

  getReportVoucher(detail: VoucherDto, typeVoucher: number) {
    this.requestDto = detail;
    this.requestDto.numberTypeVoucher = typeVoucher;
    this.oldVouchersService.getOldReport(this.requestDto)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport(this.requestDto.nameOperation + '.pdf', resp);
      }, error: _err => this.messageService.info('No se pudo cargar su comprobante: ', 'Por favor intente mas tarde.')});
  }

  getFileVoucher(detail: VoucherDto) {
    this.requestDto = detail;
    this.oldVouchersService.getOldNameFileTxt(this.requestDto)
      .subscribe({next: response => {
        this.requestDto.txtName = response.fileName;
        this.oldVouchersService.getOldFileVouchers(this.requestDto)
          .subscribe({next: (resp: Blob) => {
            this.utilsService.donwloadReport(this.requestDto.txtName, resp);
          }});
      }, error: _err => this.messageService.info('No se pudo cargar su comprobante: ', 'Por favor intente mas tarde.')});
  }

  getChecking(_e: any, _detail: any, _typeOperation: number) {
    this.requestDto.arrayVoucher = this.arrayVoucher;
    this.listVoucherChecked.emit(this.requestDto.arrayVoucher);
  }
}
