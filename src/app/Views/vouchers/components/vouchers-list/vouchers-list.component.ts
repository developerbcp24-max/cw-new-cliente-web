import { Component, OnInit, Input } from '@angular/core';
import { VouchersByOperationService } from '../../../../Services/vouchers-by-operation/vouchers-by-operation.service';
import { UserService } from '../../../../Services/users/user.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../Services/shared/global.service';
import { VoucherDto } from '../../../../Services/vouchers-by-operation/models/voucher-dto';
import { VoucherResult } from '../../../../Services/vouchers-by-operation/models/voucher-result';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-vouchers-list',
  standalone: false,
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.css'],
  providers: [VouchersByOperationService, UtilsService]
})
export class VouchersListComponent implements OnInit {

  nameReport = 'Comprobante por operación';

  requestResult: VoucherResult = new VoucherResult();
  countChecked!: number;
  formatDate!: string;
  currentDate: Date;
  vouchersLength!: number;
  companyName!: string;
  listVouchers: VoucherResult[] = [];
  allVouchersSelected = false;

  vouchersIds: VoucherResult[] = [];

  @Input()
  order!: boolean;
  @Input() vouchers: VoucherResult[] = [];
  @Input() vouchersDto: VoucherDto = new VoucherDto();

  constructor(private userService: UserService,
    private vouchersByOperationService: VouchersByOperationService,
    private globalService: GlobalService,
    private router: Router,
    private utilsService: UtilsService) {
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.vouchersLength = this.vouchers.length;
    this.companyName = this.userService.getUserToken().company_name!;
  }

  handleDownloadReport(voucher: VoucherResult) {
    this.vouchersByOperationService.getReport(voucher)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport((this.nameReport + '_' + this.companyName).replace(/\./gi, ' ') + '.pdf', resp);
      }, error: _err => this.globalService.danger('Falló descarga de comprobante: ', _err.message)});
  }

  handleAllVouchersChecked() {
    this.vouchersIds = [];
    for (const voucher of this.vouchers) {
      voucher.isSelected = this.allVouchersSelected;
      this.vouchersIds = this.changeStatus(this.allVouchersSelected, this.vouchersIds, voucher);
    }
  }

  handleVoucherChecked(voucher: VoucherResult) {
    this.vouchersIds = this.changeStatus(voucher.isSelected, this.vouchersIds, voucher);
  }

  changeStatus(selected: boolean, array: VoucherResult[], item: VoucherResult): VoucherResult[] {
    if (selected) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item, 0), 1);
    }
    return array;
  }
  handleDownloadZip() {

    this.countChecked = 0;
    this.formatDate = this.currentDate.getDate().toString() + '-' + (this.currentDate.getMonth() + 1).toString() + '-' + this.currentDate.getFullYear().toString();

    for (let i = 0; i < this.vouchersIds.length; i++) {
      this.countChecked = this.countChecked + 1;
    }
    if (this.countChecked > 0) {
      this.currentDate = new Date();

      this.vouchersByOperationService.downloadReportZip(this.vouchersIds)
        .subscribe({next: (resp: Blob) => {
          this.utilsService.donwloadReport('Comprobantes_' + this.formatDate + '.zip', resp);
        }, error: _err => this.globalService.warning('Fallo del servicio: ', _err.message)});
    } else {
      this.globalService.warning('Nota:', 'No existe ningún registro seleccionado.');
    }
  }

  handleDownloadMassive() {
    this.vouchersByOperationService.downloadReportMassive(this.vouchers)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('Comprobantes.pdf', resp);
      }, error: _err => this.globalService.warning('Fallo del servicio: ', _err.message)});
  }
}
