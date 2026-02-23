import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MultiplePaymentsData } from '../../../../Services/mass-payments/Models/multiple-payments/multiple-payments-data';
import { MultiplePaymentsService } from '../../../../Services/mass-payments/multiple-payments-service.service';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service'; // agregado
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';
import { MultiplePaymentSpreadsheetsResult } from '../../../../Services/mass-payments/Models/multiple-payments/multiple-payment-spreadsheets-result';
import { ItemMultiplePaymentUpdate } from '../../../../Services/mass-payments/Models/multiple-payments/item-multiple-payment-update';
import { MultiplePaymentUpdateDto } from '../../../../Services/mass-payments/Models/multiple-payments/multiple-payment-update-dto';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-multiple-payments-detail',
  standalone: false,
  templateUrl: './multiple-payments-detail.component.html',
  styleUrls: ['./multiple-payments-detail.component.css'],
  providers: [MultiplePaymentsService, CurrencyPipe]
})
export class MultiplePaymentsDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  @Input() isShow!: boolean;
  @Input() isAuthorize!: boolean;
  @Output() onChangeDetail = new EventEmitter();

  detail: MultiplePaymentsData = new MultiplePaymentsData();
  payments: MultiplePaymentsData = new MultiplePaymentsData();
  isVisibleAch!: boolean;
  isVisibleCash!: boolean;
  isVisibleProviders!: boolean;
  isVisibleSalaries!: boolean;
  isAuthorizeFtp!: boolean;
  rowsPerPageS: number[] = [10, 15, 20, 25];
  rowsPerPageC: number[] = [10, 15, 20, 25];
  rowsPerPageP: number[] = [10, 15, 20, 25];
  rowsPerPageA: number[] = [10, 15, 20, 25];
  pageItemsS = 10;
  pageItemsC = 10;
  pageItemsP = 10;
  pageItemsA = 10;
  multiplePaymentUpdateDto: MultiplePaymentUpdateDto = new MultiplePaymentUpdateDto();
  updateMultiplePayments: ItemMultiplePaymentUpdate[] = [];
  isCredentialsValidationVisible!: boolean;
  salariesPayment!: number;
  providersPayment!: number;
  cashPayment!: number;
  achPayment!: number;
  isValidCompanyId = false;
  isVisibleDetail = false;

  constructor(private multiplePaymentsService: MultiplePaymentsService,
    private globalService: GlobalService,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private paramService: ParametersService,) {
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    this.isAuthorizeFtp = this.userService.getUserToken().authorize_ftp! && this.isAuthorize;
    if (this.isShow) {
      this.getDetail();
    }
  }

  getDetail() {
    this.updateMultiplePayments = [];
    this.multiplePaymentUpdateDto = new MultiplePaymentUpdateDto();
    this.multiplePaymentsService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.payments.spreadsheet.formSalariesPayments = response.spreadsheet.formSalariesPayments;
        this.payments.spreadsheet.formProvidersPayments = response.spreadsheet.formProvidersPayments;
        this.payments.spreadsheet.formCashPayments = response.spreadsheet.formCashPayments;
        this.payments.spreadsheet.formAchPayments = response.spreadsheet.formAchPayments;
        this.payments.spreadsheet.formAchPayments.length > 0 ? this.isVisibleAch = true : this.isVisibleAch = false;
        this.payments.spreadsheet.formCashPayments.length > 0 ? this.isVisibleCash = true : this.isVisibleCash = false;
        this.payments.spreadsheet.formProvidersPayments.length > 0 ? this.isVisibleProviders = true : this.isVisibleProviders = false;
        this.payments.spreadsheet.formSalariesPayments.length > 0 ? this.isVisibleSalaries = true : this.isVisibleSalaries = false;
        this.salariesPayment = response.spreadsheet.formSalariesPayments.length;
        this.providersPayment = response.spreadsheet.formProvidersPayments.length;
        this.cashPayment = response.spreadsheet.formCashPayments.length;
        this.achPayment = response.spreadsheet.formAchPayments.length;
        const pageInit = 1;
        if (this.detail.spreadsheet.formSalariesPayments && this.detail.spreadsheet.formSalariesPayments.length > 0) {
          // validacion de rol-----------------
          this.isVisibleDetail = false;
          this.paramService.getValidateCompanyId()
            .subscribe({next: (resp: any) => {
              this.isValidCompanyId = resp;

              const user: any = this.userService.getUserToken();
              if(resp.body){
                for (let item of user.role) {
                  if (item.includes('AUTORIZADOR')) {
                    this.isVisibleDetail = true;
                  }
                }
              }
              //-----------------------------
              this.multiplePaymentsService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
              .subscribe({next: response => {
                this.detail = response;
                if (!this.isValidCompanyId) {
                  this.detail.spreadsheet.formAchPayments = this.payments.spreadsheet.formAchPayments.slice(((pageInit - 1) * this.pageItemsA), this.pageItemsA * pageInit);
                }
              }, error: _err => this.globalService.danger('Pagos de Haberes ACH', _err.message)});
          }, error: _err => this.globalService.danger('Parametros', _err.message)});


          this.detail.spreadsheet.formSalariesPayments = this.payments.spreadsheet.formSalariesPayments.slice(((pageInit - 1) * this.pageItemsS), this.pageItemsS * pageInit);
        }
        if (this.detail.spreadsheet.formProvidersPayments && this.detail.spreadsheet.formProvidersPayments.length > 0) {
          this.detail.spreadsheet.formProvidersPayments = this.payments.spreadsheet.formProvidersPayments.slice(((pageInit - 1) * this.pageItemsP), this.pageItemsP * pageInit);
        }
        if (this.detail.spreadsheet.formCashPayments && this.detail.spreadsheet.formCashPayments.length > 0) {
          this.detail.spreadsheet.formCashPayments = this.payments.spreadsheet.formCashPayments.slice(((pageInit - 1) * this.pageItemsC), this.pageItemsC * pageInit);
        }
        if (this.detail.spreadsheet.formAchPayments && this.detail.spreadsheet.formAchPayments.length > 0) {
          this.detail.spreadsheet.formAchPayments = this.payments.spreadsheet.formAchPayments.slice(((pageInit - 1) * this.pageItemsA), this.pageItemsA * pageInit);
        }
      }, error: _err => this.globalService.danger('No se pudo obtener el Detalle', _err.message)});
  }

  handlePageChangedSalaries($event: number) {
    this.detail.spreadsheet.formSalariesPayments = this.payments.spreadsheet.formSalariesPayments.slice((($event - 1) * this.pageItemsS), this.pageItemsS * $event);
  }

  handlePageChangedProviders($event: number) {
    this.detail.spreadsheet.formProvidersPayments = this.payments.spreadsheet.formProvidersPayments.slice((($event - 1) * this.pageItemsP), this.pageItemsP * $event);
  }

  handlePageChangedCash($event: number) {
    this.detail.spreadsheet.formCashPayments = this.payments.spreadsheet.formCashPayments.slice((($event - 1) * this.pageItemsC), this.pageItemsC * $event);
  }

  handlePageChangedAch($event: number) {
    this.detail.spreadsheet.formAchPayments = this.payments.spreadsheet.formAchPayments.slice((($event - 1) * this.pageItemsA), this.pageItemsA * $event);
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


  handleRemove(data: MultiplePaymentSpreadsheetsResult) {
    data.isDelete = true;
    this.updateTotalAmount(data.multiplePaymentId, 0);
    data.isEdit = false;
  }

  handleSave(data: MultiplePaymentSpreadsheetsResult) {
    if (data.amount <= 0) {
      this.globalService.danger('Actualización de montos', `El monto no puede ser 0`);
    } else {
      this.updateTotalAmount(data.multiplePaymentId, data.amount);
      data.isEdit = false;
    }
  }

  handleCredentialsValidationSubmit($event: any) {
    this.multiplePaymentUpdateDto.multiplePayments = this.updateMultiplePayments;
    this.multiplePaymentUpdateDto.tokenCode = $event.code;
    this.multiplePaymentUpdateDto.tokenName = $event.name;

    this.multiplePaymentsService.updateMultiplePayments(this.multiplePaymentUpdateDto)
      .subscribe({next: response => {
        this.isCredentialsValidationVisible = false;
        this.getDetail();
        this.globalService.success('Actualización de montos', `Se actualizó  correctamente el lote ${this.batchId}, su nuevo monto es: ${this.currencyPipe.transform(response.totalAmount)}`, true);
        this.onChangeDetail.emit();
      }, error: _err => this.globalService.danger('Autorización', _err.message)});
  }

  updateTotalAmount(paymentId: number, newAmount: number) {
    const index = this.updateMultiplePayments.findIndex(x => x.multiplePaymentId === paymentId);
    if (index > -1) {
      this.updateMultiplePayments.splice(index, 1);
    }
    this.detail.amount = this.detail.spreadsheet.formAchPayments.map(x => !x.isDelete ? +x.amount : 0)
      .concat(this.detail.spreadsheet.formCashPayments.map(x => !x.isDelete ? +x.amount : 0))
      .concat(this.detail.spreadsheet.formProvidersPayments.map(x => !x.isDelete ? +x.amount : 0))
      .concat(this.detail.spreadsheet.formSalariesPayments.map(x => !x.isDelete ? +x.amount : 0))
      .reduce((a, b) => a + b, 0);
    this.updateMultiplePayments.push({ multiplePaymentId: paymentId, amount: newAmount });
  }

  handleGroupChanged($event: number) {

  }
}
