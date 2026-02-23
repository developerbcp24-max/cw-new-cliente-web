import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { CashPaymentsService } from '../../../../Services/mass-payments/cash-payments.service';
import { CashPaymentData } from '../../../../Services/mass-payments/Models/cash-payments/cash-payment-data';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-cash-payment-detail',
  standalone: false,
  templateUrl: './cash-payment-detail.component.html',
  styleUrls: ['./cash-payment-detail.component.css'],
  providers: [CashPaymentsService]
})
export class CashPaymentDetailComponent implements OnInit, OnChanges {
  @Input() batchId!: number;
  detail: CashPaymentData = new CashPaymentData();
  payments: CashPaymentData = new CashPaymentData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private cashPaymentService: CashPaymentsService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cashPaymentService.getDetail(new MassivePaymentsSpreadsheetsDto({ id : this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pagos en Efectivo', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

}
