import { Component, OnInit, Input } from '@angular/core';
import { CreditsService } from '../../../../Services/credits/credits.service';
import { QuotaPaymentDetailResult } from '../../../../Services/credits/models/quota-payment-detail-result';

@Component({
  selector: 'app-quota-payment-detail',
  standalone: false,
  templateUrl: './quota-payment-detail.component.html',
  styleUrls: ['./quota-payment-detail.component.css'],
  providers: [CreditsService]
})
export class QuotaPaymentDetailComponent implements OnInit {

  @Input() batchId!: number;
  detail: QuotaPaymentDetailResult = new QuotaPaymentDetailResult();
  constructor(private creditsService: CreditsService) { }

  ngOnInit() {
    this.creditsService.GetQuotaPaymentDetail({ processBatchId: this.batchId })
      .subscribe({next: res => {
        this.detail = res;
      }});
  }
}
