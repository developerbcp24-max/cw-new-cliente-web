import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { SalariesPaymentData } from '../../../../Services/mass-payments/Models/salaries-payments/salaries-payment-data';
import { SalariesPaymentsService } from '../../../../Services/mass-payments/salaries-payments.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';

@Component({
  selector: 'app-salaries-payments-detail',
  standalone: false,
  templateUrl: './salaries-payments-detail.component.html',
  styleUrls: ['./salaries-payments-detail.component.css'],
  providers: [SalariesPaymentsService]
})
export class SalariesPaymentsDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  detail: SalariesPaymentData = new SalariesPaymentData();
  payments: SalariesPaymentData = new SalariesPaymentData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;
  isValidCompanyId = false;
  isVisibleDetail = false;

  constructor(private salariesPaymentService: SalariesPaymentsService, private globalService: GlobalService,
    private paramService: ParametersService, private userService: UserService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    // validacion de rol-----------------
    this.isVisibleDetail = false;
    this.paramService.getValidateCompanyId()
      .subscribe({next: (resp: any) => {
        let res = resp.body;
        this.isValidCompanyId = res;
        if (resp.body) {
          const user: any = this.userService.getUserToken();
          for (let item of user.role) {
            if (item.includes('AUTORIZADOR')) {
              this.isVisibleDetail = true;
            }
          }
        }
        //-----------------------------
        this.salariesPaymentService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
          .subscribe({next: response => {
            this.detail = response;
            if (!this.isValidCompanyId) {
              this.handlePageChanged(1);
            }
          }, error: _err => this.globalService.danger('Pagos de Haberes', _err.message)});
      }, error: _err => this.globalService.danger('Parametros', _err.message)});

  }

  validateCompanyId() {
    this.paramService.getValidateCompanyId()
      .subscribe({next: resp => {
        this.isValidCompanyId = resp;
      }, error: _err => this.globalService.danger('Parametros', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

}
