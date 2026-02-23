import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TelephoneServicesService } from '../../../../Services/telephone-services/telephone-services.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ProcessBatchId } from '../../../../Services/shared/models/process-batch-id';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { TigoPaymentsService } from '../../../../Services/tigo-payments/tigo-payments.service';

@Component({
  selector: 'app-telephony-payments-detail',
  standalone: false,
  templateUrl: './telephony-payments-detail.component.html',
  styleUrls: ['./telephony-payments-detail.component.css'],
  providers: [TelephoneServicesService, TigoPaymentsService]
})
export class TelephonyPaymentsDetailComponent implements OnInit {

  @Input() batchId!: number;
  @Input() operationTypeId!: number;
  batch: any;

  constructor(private telephoneServicesService: TelephoneServicesService, private globalService: GlobalService,
    private paramService: ParametersService, private tigoPaymentsService: TigoPaymentsService){

  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.operationTypeId == OperationType.pagoServicioEntel) {
      this.telephoneServicesService.getDetail(new ProcessBatchId({ processBatchId: this.batchId}))
      .subscribe({next: response => {
        this.batch = response;
        this.paramService.getByGroupAndCode(new ParameterDto({ group: 'MONTRS', code: this.batch.currency }))
        .subscribe({next: resp => {this.batch.currency = resp.description;}});
      }, error: _err => {this.globalService.danger('Pago de servicios', _err.message)}});
    } else if (this.operationTypeId == OperationType.pagoServicioTigo) {
      this.tigoPaymentsService.getDetail(new ProcessBatchId({ processBatchId: this.batchId}))
      .subscribe({next: response => {
        this.batch = response;
        this.paramService.getByGroupAndCode(new ParameterDto({ group: 'MONTRS', code: this.batch.currency }))
        .subscribe({next: resp => {this.batch.currency = resp.description}});
      }, error: _err => this.globalService.danger('Pago de servicios', _err.message)});
    }

  }

}
