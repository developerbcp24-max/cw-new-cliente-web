import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ProvidersDepositInOtherBankCheckData } from '../../../../Services/providersDepositInOtherBankCheck/models/providers-deposit-in-other-bank-check-data';
import { ProvidersDepositInOtherBankCheckService } from '../../../../Services/providersDepositInOtherBankCheck/providers-deposit-in-other-bank-check.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';

@Component({
  selector: 'app-providers-deposit-other-bank-checks-detail',
  standalone: false,
  templateUrl: './providers-deposit-other-bank-checks-detail.component.html',
  styleUrls: ['./providers-deposit-other-bank-checks-detail.component.css'],
  providers: [ProvidersDepositInOtherBankCheckService]
})
export class ProvidersDepositOtherBankChecksDetailComponent implements OnInit, OnChanges {
  @Input() batchId!: number;
  detail: ProvidersDepositInOtherBankCheckData = new ProvidersDepositInOtherBankCheckData();
  payments: ProvidersDepositInOtherBankCheckData = new ProvidersDepositInOtherBankCheckData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private ProvidersDepositInOtherBankCheckService: ProvidersDepositInOtherBankCheckService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ProvidersDepositInOtherBankCheckService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err => this.globalService.danger('Proveedores Otro Cheque', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
