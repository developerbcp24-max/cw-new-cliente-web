import { Component, OnInit, Input } from '@angular/core';
import { ServicePaseService } from '../../../../Services/service-pase/service-pase.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ProcessBatchId } from '../../../../Services/shared/models/process-batch-id';
import { ServicesPasePaymentDetail } from '../../../../Services/service-pase/models/services-pase-payment-detail';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';

@Component({
  selector: 'app-service-pase-payment-detail',
  standalone: false,
  templateUrl: './service-pase-payment-detail.component.html',
  styleUrls: ['./service-pase-payment-detail.component.css'],
  providers: [ServicePaseService]
})
export class ServicePasePaymentDetailComponent implements OnInit {

  @Input() batchId!: number;
  detail: ServicesPasePaymentDetail = new ServicesPasePaymentDetail();
  isDelapaz = false;
  isSemapa = false;

  constructor(private paseService: ServicePaseService, private globalService: GlobalService, private paramService: ParametersService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(): void {
    this.isDelapaz = false;
    const dto: ProcessBatchId = { processBatchId: this.batchId };
    this.paseService.getDetail(dto)
      .subscribe({next: res => {
        this.detail = res;
        this.isSemapa = this.detail.detail[0].companyCode === '683' ? true : false;
        this.paramService.getByGroupAndCode(new ParameterDto({ group: 'MONTRS', code: this.detail.currency }))
          .subscribe({next: response => this.detail.currency = response.description});
        this.isDelapaz = this.detail.serviceType.includes('DELAPAZ');
      }, error: _err => this.globalService.danger('Pago de Servicios', _err.message)});
  }

}
