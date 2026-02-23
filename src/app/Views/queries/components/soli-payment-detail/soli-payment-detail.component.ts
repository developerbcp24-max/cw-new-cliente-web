import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { SoliPaymentData } from '../../../../Services/mass-payments/Models/soli-payments/soli-payment-data';
import { SoliPaymentsService } from '../../../../Services/mass-payments/soli-payments.service';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-soli-payment-detail',
  standalone: false,
  templateUrl: './soli-payment-detail.component.html',
  styleUrls: ['./soli-payment-detail.component.css'],
  providers: [SoliPaymentsService]
})
export class SoliPaymentDetailComponent implements OnInit,OnChanges {

  @Input() batchId!: number;
  detail: SoliPaymentData = new SoliPaymentData();
  payments: SoliPaymentData = new SoliPaymentData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private soliPaymentService: SoliPaymentsService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.soliPaymentService.getDetail(new MassivePaymentsSpreadsheetsDto({ id : this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Pagos Soli', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

}
