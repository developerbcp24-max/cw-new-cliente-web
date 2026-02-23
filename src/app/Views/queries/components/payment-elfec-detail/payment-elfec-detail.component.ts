import { Component, OnInit, Input } from '@angular/core';
import { ElfecService } from '../../../../Services/elfec/elfec.service';
import { PaymentElfecDetailDto } from '../../../../Services/elfec/models/payment-elfec-detail-dto';
import { PaymentElfecDetailResult } from '../../../../Services/elfec/models/payment-elfec-detail-result';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-payment-elfec-detail',
  standalone: false,
  templateUrl: './payment-elfec-detail.component.html',
  styleUrls: ['./payment-elfec-detail.component.css'],
  providers: [ElfecService]
})
export class PaymentElfecDetailComponent implements OnInit {

  @Input() batchId!: number;
  detail: PaymentElfecDetailResult = new PaymentElfecDetailResult();

  constructor(private elfecService: ElfecService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(): void {
    const dto: PaymentElfecDetailDto = { processBatchId: this.batchId };
    this.elfecService.getPaymetElfecDetail(dto)
      .subscribe({next: res => {
        this.detail = res;
      }, error: _err => this.globalService.danger('Pago de Elfec', _err.message)});
  }
}
