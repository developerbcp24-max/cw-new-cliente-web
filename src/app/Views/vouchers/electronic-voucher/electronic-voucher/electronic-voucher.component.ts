import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountPartialModel } from '../../../../Services/historical-accounts/models/AccountPartialModel';
import { AccountUse } from '../../../../Services/shared/enums/account-use';
import { Roles } from '../../../../Services/shared/enums/roles';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { ElectronicVoucherService } from '../../../../Services/vouchers/electronic-voucher/electronic-voucher.service';
import { GetElectronicVouchersResponse } from '../../../../Services/vouchers/electronic-voucher/models/get-electronic-vouchers-response';
import { ElectronicVoucherDto } from '../../../../Services/vouchers/electronic-voucher/models/electronic-voucher-dto';
import { DateRangeModel, OptionsDateRange } from '../../../shared/cw-components/date-range/date-range.component';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';


@Component({
  selector: 'app-electronic-voucher',
  standalone: false,
  templateUrl: './electronic-voucher.component.html',
  styleUrls: ['./electronic-voucher.component.css'],
  providers: [ElectronicVoucherService]
})
export class ElectronicVoucherComponent implements OnInit {
  listElectronicVoucher: GetElectronicVouchersResponse[] = [];
  resultElectronicVoucher: GetElectronicVouchersResponse[] = [];
  sourceAccountRequest: AccountDto = new AccountDto();
  public AccountSelected: AccountPartialModel = new AccountPartialModel();
  types: string[] = ['P'];
  swTable = false;
  isVisibleError = false;
  electronicVoucherRequest: ElectronicVoucherDto = new ElectronicVoucherDto();

  dateRange: DateRangeModel = new DateRangeModel();

  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false,
    maxMonthRange: 3
  };

  message!: string;
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 10;
  totalItems!: number;

  constructor(private EltVoucherService: ElectronicVoucherService, private globalService: GlobalService,
    private cdRef: ChangeDetectorRef,private userService: UserService) { }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.sourceAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      operationTypeId: [OperationType.consultarCuentas],
      types: this.types
    });
    this.swTable = false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleGenerate() {
    this.electronicVoucherRequest.dateInitial = this.dateRange.dateInit!;
    this.electronicVoucherRequest.dateEnd = this.dateRange.dateEnd!;
    if (this.dateRange.isValid) {
      this.getListElectronicVoucher(this.electronicVoucherRequest);
    }
  }
  handleSourceAccountChanged($event: any) {
    this.AccountSelected = $event;
    this.electronicVoucherRequest.formattedAccount = this.AccountSelected.formattedNumber;
    this.swTable = false;
  }

  getListElectronicVoucher(electronicVoucherRequest: ElectronicVoucherDto) {
    this.swTable = false;
    this.isVisibleError = false;
    this.EltVoucherService.getListElectronicVoucher(electronicVoucherRequest)
      .subscribe({next: (response: GetElectronicVouchersResponse[]) => {
        if (response != null) {
          this.listElectronicVoucher = response;
          this.resultElectronicVoucher = this.listElectronicVoucher;
          this.totalItems = response.length;
          this.swTable = true;
        } else {
          this.isVisibleError = true;
          this.message = 'No existe ningún registro.';
        }
      }, error: _err => this.globalService.warning('Comprobante Electronico', _err.message)});
  }

  handlePageChanged($event: number) {
    this.listElectronicVoucher = this.resultElectronicVoucher.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
