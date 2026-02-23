import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BatchIdDto } from '../../../../Services/service-payments/models/batch-id-dto';
import { ServicePaymentsService } from '../../../../Services/service-payments/service-payments.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';

@Component({
  selector: 'app-service-payment-batch-detail',
  standalone: false,
  templateUrl: './service-payment-batch-detail.component.html',
  styleUrls: ['./service-payment-batch-detail.component.css'],
  providers: [ServicePaymentsService]
})
export class ServicePaymentBatchDetailComponent implements OnInit, OnChanges {

  batch: any;
  constants: Constants = new Constants();
  @Input() batchId!: number;
  @Input() service!: string;

  constructor(private servicePaymentService: ServicePaymentsService, private globalService: GlobalService, private paramService: ParametersService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.service !== this.constants.afpService) {
      this.servicePaymentService.getBatchDetail(new BatchIdDto({ processBatchId: this.batchId, service: this.service }))
        .subscribe({next: response => {
          this.batch = response;
          this.paramService.getByGroupAndCode(new ParameterDto({ group: 'MONTRS', code: this.batch.currency }))
          .subscribe({next: resp => {this.batch.currency = resp.description;}});
        }, error: _err => {this.globalService.danger('Pago de servicios', _err.message)}
      });
    }
  }

}
