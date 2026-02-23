import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CashPaymentsInLineService } from '../../../../Services/mass-payments/cash-payments-in-line.service';
import { CashPaymentInLineData } from '../../../../Services/mass-payments/Models/cash-payments-in-line/cash-payment-in-line-data';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-cash-payment-in-line-detail',
  standalone: false,
  templateUrl: './cash-payment-in-line-detail.component.html',
  styleUrls: ['./cash-payment-in-line-detail.component.css'],
  providers: [CashPaymentsInLineService]
})
export class CashPaymentInLineDetailComponent implements OnInit {

  @Input() batchId!: number;
  detail: CashPaymentInLineData = new CashPaymentInLineData();
  payments: CashPaymentInLineData = new CashPaymentInLineData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private cashPaymentOnlineService: CashPaymentsInLineService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cashPaymentOnlineService.getDetail(new MassivePaymentsSpreadsheetsDto({ id : this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pago Efectivo Online', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

}
