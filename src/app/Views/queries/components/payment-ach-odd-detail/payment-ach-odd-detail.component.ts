import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PaymentOddAchData } from '../../../../Services/mass-payments/Models/payment-odd-ach/payment-odd-ach-data';
import { PaymentOddAchService } from '../../../../Services/mass-payments/payment-odd-ach.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { BatchIdDto } from '../../../../Services/service-payments/models/batch-id-dto';

@Component({
  selector: 'app-payment-ach-odd-detail',
  standalone: false,
  templateUrl: './payment-ach-odd-detail.component.html',
  styleUrls: ['./payment-ach-odd-detail.component.css'],
  providers: [PaymentOddAchService]
})
export class PaymentAchOddDetailComponent implements OnInit, OnChanges {
  @Input() batchId!: number;
  detail: PaymentOddAchData = new PaymentOddAchData();
  payments: PaymentOddAchData = new PaymentOddAchData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private paymentOddAchService: PaymentOddAchService,
    private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paymentOddAchService.getPaymentDetail(new BatchIdDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pagos AchOdd.', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
