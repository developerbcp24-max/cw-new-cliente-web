import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PaymentAchData } from '../../../../Services/mass-payments/Models/payment-ach/payment-ach-data';
import { PaymentAchService } from '../../../../Services/mass-payments/payment-ach.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { BatchIdDto } from '../../../../Services/service-payments/models/batch-id-dto';

@Component({
  selector: 'app-payment-bank-ach-detail',
  standalone: false,
  templateUrl: './payment-bank-ach-detail.component.html',
  styleUrls: ['./payment-bank-ach-detail.component.css'],
  providers: [PaymentAchService]
})
export class PaymentBankAchDetailComponent implements OnInit {
  @Input() batchId!: number;
  detail: PaymentAchData = new PaymentAchData();
  payments: PaymentAchData = new PaymentAchData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private paymentAchService: PaymentAchService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paymentAchService.getPaymentDetail(new BatchIdDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pagos ACH.', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
