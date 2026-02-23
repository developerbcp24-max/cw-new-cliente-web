import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { ProvidersPaymentData } from '../../../../Services/mass-payments/Models/providers-payments/providers-payment-data';
import { ProvidersPaymentsService } from '../../../../Services/mass-payments/providers-payments.service';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-providers-payment-detail',
  standalone: false,
  templateUrl: './providers-payment-detail.component.html',
  styleUrls: ['./providers-payment-detail.component.css'],
  providers: [ProvidersPaymentsService]
})
export class ProvidersPaymentDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  detail: ProvidersPaymentData = new ProvidersPaymentData();
  payments: ProvidersPaymentData = new ProvidersPaymentData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private providersPaymentService: ProvidersPaymentsService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.providersPaymentService.getDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pagos a proveedores', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
