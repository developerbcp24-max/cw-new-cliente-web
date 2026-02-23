import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../../../../Services/shared/global.service';
import { GetElectronicVouchersResponse } from '../../../../../Services/vouchers/electronic-voucher/models/get-electronic-vouchers-response';
import { ElectronicVoucherService } from '../../../../../Services/vouchers/electronic-voucher/electronic-voucher.service';
import { UtilsService } from '../../../../../Services/shared/utils.service';


@Component({
  selector: 'app-table-electronic-voucher',
  standalone: false,
  templateUrl: './table-electronic-voucher.component.html',
  styleUrls: ['./table-electronic-voucher.component.css'],
  providers: [ElectronicVoucherService, UtilsService]
})
export class TableElectronicVoucherComponent implements OnInit {

  @Input() listElectronicVoucher: GetElectronicVouchersResponse[]=[]/*  ojosos= new GetElectronicVouchersResponse() */;

  constructor(private globalService: GlobalService,
    private electronicVoucherService: ElectronicVoucherService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    /*This is intentional*/
  }
  handleGetReport(listElectronicVouchersResponse: GetElectronicVouchersResponse) {
    this.electronicVoucherService.getReport(listElectronicVouchersResponse)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('RptCompElt.pdf', resp);
      }, error: _err => this.globalService.danger('Fallo del servicio: ', _err.message)});

  }
}
