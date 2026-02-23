import { Component, OnInit, Input } from '@angular/core';
import { NewPasePaymentDetailResult } from '../../../../Services/new-pase/models/new-pase-payment-detail-result';
import { NewPaseService } from '../../../../Services/new-pase/new-pase.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ProcessBatchId } from '../../../../Services/shared/models/process-batch-id';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ProcessBatchIdLine } from '../../../../Services/shared/models/process-batch-id-line';
/* import { Services } from '@angular/core/src/view'; */
import { ServiceTypes } from '../../../../Services/shared/enums/service-types';

@Component({
  selector: 'app-new-pase-payment-detail',
  standalone: false,
  templateUrl: './new-pase-payment-detail.component.html',
  styleUrls: ['./new-pase-payment-detail.component.css'],
  providers: [NewPaseService, UtilsService]
})
export class NewPasePaymentDetailComponent implements OnInit {

  @Input() batchId!: number;
  @Input() operationTypeId!: number;
  isGenericPayment = false;
  detail: NewPasePaymentDetailResult = new NewPasePaymentDetailResult();
  processBatchIdLine: ProcessBatchIdLine = new ProcessBatchIdLine();
  constructor(private newPaseService: NewPaseService, private globalService: GlobalService, private utilsService: UtilsService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(): void {
    const dto: ProcessBatchId = { processBatchId: this.batchId };
    this.newPaseService.getDetail(dto)
      .subscribe({next: res => {
        this.detail = res;
        this.isGenericPayment = this.detail.detail[0].isGenericPayment;
        if (!this.isGenericPayment) {
          for (let item of this.detail.detail) {
            if (item.companyCode == ServiceTypes.Cotas.toString()) {
              let valores = item.paymentInformation.split(',');
              item.paymentInformation = valores[0];
            } else if (item.companyCode == ServiceTypes.Axs.toString()) {
              item.paymentInformation = this.getPeriod(item.paymentInformation);
            }
          }
        }

      }, error: _err => this.globalService.danger('Pago de Servicio', _err.message)});
  }

  getPeriod($event: any) {
    let result = $event.split('-');
    let resp = '';
    for (let det of result) {
      if (det.includes('Period')) {
        let period = det.trim().split(' ');
        resp = period[1].trim();
      }
    }
    return resp;
  }

  handleGetBilling(processBatchId: any, line: number) {
    this.processBatchIdLine.processBatchId = processBatchId;
    this.processBatchIdLine.line = line;
    this.newPaseService.getBill(this.processBatchIdLine)
    .subscribe({next: (resp: Blob) => {
      this.utilsService.donwloadReport('Factura_'+ processBatchId +'_'+line, resp);
    }, error: _err => {
      console.error('Fallo del export: ', _err.message)}});
  }

}
