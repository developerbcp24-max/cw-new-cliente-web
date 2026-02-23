import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { PaymentTaxCheckData } from '../../../../Services/taxPaymentCheck/models/payment-tax-check-data';
import { TaxPaymentCheckService } from '../../../../Services/taxPaymentCheck/tax-payment-check.service';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';

@Component({
  selector: 'app-payment-tax-check-detail',
  standalone: false,
  templateUrl: './payment-tax-check-detail.component.html',
  styleUrls: ['./payment-tax-check-detail.component.css'],
  providers: [TaxPaymentCheckService]
})
export class PaymentTaxCheckDetailComponent implements OnInit, OnChanges {
  @Input() batchId!: number;
  detail: PaymentTaxCheckData = new PaymentTaxCheckData();
  payments: PaymentTaxCheckData = new PaymentTaxCheckData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private TaxPaymentCheckService: TaxPaymentCheckService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.TaxPaymentCheckService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pago Impuestos Cheque Gerencia', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
