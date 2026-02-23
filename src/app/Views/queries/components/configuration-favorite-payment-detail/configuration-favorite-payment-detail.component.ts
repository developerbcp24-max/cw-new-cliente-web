import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { FavoritePaymentsData } from '../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { GlobalService } from '../../../../Services/shared/global.service';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { FavoritePaymentsConfigService } from '../../../../Services/mass-payments/favorite-payments-config.service';

@Component({
  selector: 'app-configuration-favorite-payment-detail',
  standalone: false,
  templateUrl: './configuration-favorite-payment-detail.component.html',
  styleUrls: ['./configuration-favorite-payment-detail.component.css'],
  providers: [FavoritePaymentsConfigService]
})
export class ConfigurationFavoritePaymentDetailComponent implements OnInit {

  @Input() batchId!: number;
  detail: FavoritePaymentsData = new FavoritePaymentsData();
  payments: FavoritePaymentsData = new FavoritePaymentsData();
  isVisibleAch!: boolean;
  isVisibleCash!: boolean;
  isVisibleProviders!: boolean;
  isVisibleSalaries!: boolean;

  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private favoriteConfigPaymentService: FavoritePaymentsConfigService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.favoriteConfigPaymentService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.detail.spreadsheet.formAchPayments.length > 0 ? this.isVisibleAch = true : this.isVisibleAch = false;
        this.detail.spreadsheet.formCashPayments.length > 0 ? this.isVisibleCash = true : this.isVisibleCash = false;
        this.detail.spreadsheet.formProvidersPayments.length > 0 ? this.isVisibleProviders = true : this.isVisibleProviders = false;
        this.detail.spreadsheet.formSalariesPayments.length > 0 ? this.isVisibleSalaries = true : this.isVisibleSalaries = false;
      }, error: _err => this.globalService.danger('No se pudo obtener el Detalle', _err.message)});
  }

  handlePageChangedSalaries($event: number) {
    this.payments.spreadsheet.formSalariesPayments = this.detail.spreadsheet.formSalariesPayments.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRowsSalaries($event: string) {
    this.pageItems = +$event;
    this.handlePageChangedSalaries(0);
  }

  handlePageChangedProviders($event: number) {
    this.payments.spreadsheet.formProvidersPayments = this.detail.spreadsheet.formProvidersPayments.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRowsProviders($event: string) {
    this.pageItems = +$event;
    this.handlePageChangedProviders(0);
  }

  handlePageChangedCash($event: number) {
    this.payments.spreadsheet.formCashPayments = this.detail.spreadsheet.formCashPayments.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRowsCash($event: string) {
    this.pageItems = +$event;
    this.handlePageChangedCash(0);
  }

  handlePageChangedAch($event: number) {
    this.payments.spreadsheet.formAchPayments = this.detail.spreadsheet.formAchPayments.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRowsAch($event: string) {
    this.pageItems = +$event;
    this.handlePageChangedAch(0);
  }
}
