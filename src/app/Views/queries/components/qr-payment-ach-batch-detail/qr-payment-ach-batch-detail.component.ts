import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { QrPaymentAchDetail } from '../../../../Services/QrPaymentAch/Models/qr-payment-ach';
import { QrPaymentAchService } from '../../../../Services/QrPaymentAch/qr-payment-ach.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { BatchIdDto } from '../../../../Services/shared/models/batch-id-dto';

@Component({
  selector: 'app-qr-payment-ach-batch-detail',
  standalone: false,
  templateUrl: './qr-payment-ach-batch-detail.component.html',
  styleUrls: ['./qr-payment-ach-batch-detail.component.css'],
})
export class QrPaymentAchBatchDetailComponent implements OnChanges {
  detail: QrPaymentAchDetail = new QrPaymentAchDetail();
  @Input() batchId: number = 0;

  constructor(
    private qrPaymentAchService: QrPaymentAchService,
    private globalService: GlobalService,
    private paramService: ParametersService
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    this.qrPaymentAchService
      .getDetail(new BatchIdDto({ batchId: this.batchId }))
      .subscribe({
        next: (response) => {
          this.detail = response;
          this.paramService
            .getByGroupAndCode(
              new ParameterDto({ group: 'MONTRS', code: this.detail.currency })
            )
            .subscribe({
              next: (resp) => (this.detail.currency = resp.description),
            });
        },
        error: (_err) =>
          this.globalService.danger('Pago QR (APP)', _err.message),
      });
  }
}
