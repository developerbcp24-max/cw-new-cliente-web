import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { FavoritePaymentsData } from '../../../../Services/mass-payments/Models/favorite-payments/favorite-payments-data';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';
import { FavoritePaymentsService } from '../../../../Services/mass-payments/favorite-payments.service';

@Component({
  selector: 'app-favorite-payments-detail',
  standalone: false,
  templateUrl: './favorite-payments-detail.component.html',
  styleUrls: ['./favorite-payments-detail.component.css'],
  providers: [FavoritePaymentsService]
})
export class FavoritePaymentsDetailComponent implements OnInit {

  @Input() batchId!: number;
  detail: FavoritePaymentsData = new FavoritePaymentsData();
  payments: FavoritePaymentsData = new FavoritePaymentsData();
  isVisibleAch!: boolean;
  isVisibleCash!: boolean;
  isVisibleProviders!: boolean;
  isVisibleSalaries!: boolean;
  rowsPerPageS: number[] = [10, 15, 20, 25];
  rowsPerPageC: number[] = [10, 15, 20, 25];
  rowsPerPageP: number[] = [10, 15, 20, 25];
  rowsPerPageA: number[] = [10, 15, 20, 25];
  pageItemsS = 10;
  pageItemsC = 10;
  pageItemsP = 10;
  pageItemsA = 10;
  isValidCompanyId = false;
  isVisibleDetail = false;

  constructor(private favoritePaymentsService: FavoritePaymentsService, private globalService: GlobalService,
    private paramService: ParametersService, private userService: UserService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.favoritePaymentsService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;

        this.detail.spreadsheet.formAchPayments.length > 0 ? this.isVisibleAch = true : this.isVisibleAch = false;
        if (this.detail.spreadsheet.formAchPayments.length > 0) { this.handlePageChangedAch(1); }
        this.detail.spreadsheet.formCashPayments.length > 0 ? this.isVisibleCash = true : this.isVisibleCash = false;
        if (this.detail.spreadsheet.formCashPayments.length > 0) { this.handlePageChangedCash(1); }
        this.detail.spreadsheet.formProvidersPayments.length > 0 ? this.isVisibleProviders = true : this.isVisibleProviders = false;
        if (this.detail.spreadsheet.formProvidersPayments.length > 0) { this.handlePageChangedProviders(1); }
        this.detail.spreadsheet.formSalariesPayments.length > 0 ? this.isVisibleSalaries = true : this.isVisibleSalaries = false;
        if (this.detail.spreadsheet.formSalariesPayments.length > 0) {
          this.isVisibleDetail = false;
          this.paramService.getValidateCompanyId()
            .subscribe({next: (resp: any) => {
              this.isValidCompanyId = resp;
              if (resp.body) {
                const user: any = this.userService.getUserToken();
                for (let item of user.role) {
                  if (item.includes('AUTORIZADOR')) {
                    this.handlePageChangedSalaries(1);
                  }
                }
              }
            }, error: _err => this.globalService.danger('Parametros', _err.message)});

        }
      }, error: _err => this.globalService.danger('No se pudo obtener el Detalle', _err.message)});
  }

  handlePageChangedSalaries($event: number) {
    this.payments.spreadsheet.formSalariesPayments = this.detail.spreadsheet.formSalariesPayments.slice((($event - 1) * this.pageItemsS), this.pageItemsS * $event);
  }

  handlePageChangedProviders($event: number) {
    this.payments.spreadsheet.formProvidersPayments = this.detail.spreadsheet.formProvidersPayments.slice((($event - 1) * this.pageItemsP), this.pageItemsP * $event);
  }

  handlePageChangedCash($event: number) {
    this.payments.spreadsheet.formCashPayments = this.detail.spreadsheet.formCashPayments.slice((($event - 1) * this.pageItemsC), this.pageItemsC * $event);
  }

  handlePageChangedAch($event: number) {
    this.payments.spreadsheet.formAchPayments = this.detail.spreadsheet.formAchPayments.slice((($event - 1) * this.pageItemsA), this.pageItemsA * $event);
  }

  handleViewRowsSalaries($event: string) {
    this.pageItemsS = +$event;
    this.handlePageChangedSalaries(1);
  }

  handleViewRowsProviders($event: string) {
    this.pageItemsP = +$event;
    this.handlePageChangedProviders(1);
  }

  handleViewRowsCash($event: string) {
    this.pageItemsC = +$event;
    this.handlePageChangedCash(1);
  }

  handleViewRowsAch($event: string) {
    this.pageItemsA = +$event;
    this.handlePageChangedAch(1);
  }
}
