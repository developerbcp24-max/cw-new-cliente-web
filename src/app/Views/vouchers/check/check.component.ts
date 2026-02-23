import { Component, OnInit } from '@angular/core';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { ChecksService } from '../../../Services/checks/checks.service';
import {
  CheckResult,
  CheckListResult,
} from '../../../Services/checks/models/check-result';
import { AccountResult } from '../../../Services/accounts/models/account-result';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { Roles } from '../../../Services/shared/enums/roles';
import { CheckListDto } from '../../../Services/checks/models/check-list-dto';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../../../Services/shared/utils.service';
import moment, { Moment } from 'moment';
import { UserService } from '../../../Services/users/user.service';

@Component({
  selector: 'app-check',
  standalone: false,
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
  providers: [ChecksService, UtilsService],
})
export class CheckComponent implements OnInit {
  public checks: CheckListResult = new CheckListResult();
  public accountSelected: AccountResult = new AccountResult();
  sourceAccountRequest: AccountDto = new AccountDto();
  public informationModel: CheckListDto = new CheckListDto();

  public DateCheck: Date = new Date();
  public DateCheckStr!: string;
  swTable!: boolean;
  public existsImage = false;
  public stringBase64 = '';
  public aux: CheckResult = new CheckResult();
  disabledDate = moment(new Date()).add(1, 'd').toDate();
  constructor(
    private checksService: ChecksService,
    private domSanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  public myDatePickerOptions: IMyDpOptions = {
    editableDateField: false,
    openSelectorOnInputClick: true,
    dateFormat: 'dd/mm/yyyy',
    inline: false,
    showTodayBtn: true,
    minYear: 2000,
    maxYear: 2030,
    disableSince: {
      year: this.disabledDate.getFullYear(),
      month: this.disabledDate.getMonth() + 1,
      day: this.disabledDate.getDate(),
    },
  };

  showError = false;
  errorMessage!: string;
  isVisibleError = false;
  message!: string;

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.sourceAccountRequest = new AccountDto({
      operationTypeId: [OperationType.consultarCuentas],
      types: [String.fromCharCode(AccountTypes.passive)],
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
    });
    this.swTable = false;
  }

  handleSearch() {
    if (this.IsValid()) {
      this.listCheck(this.informationModel);
    } else {
      this.isVisibleError = false;
      this.swTable = false;
    }
  }

  IsValid(): boolean {
    this.showError = false;
    let flag = true;
    if (!this.informationModel.regDate) {
      flag = false;
      this.showError = true;
      this.errorMessage = 'Debe ingresar una fecha';
    }
    return flag;
  }

  listCheck(informationModel: CheckListDto) {
    this.isVisibleError = false;
    this.checksService.getChecks(informationModel).subscribe({
      next: (response: CheckListResult) => {
        this.checks = response;
        this.swTable = true;
      },
      error: (_err) => {
        this.isVisibleError = true;
        this.message = _err.message;
        this.swTable = false;
      },
    });
  }

  handleBase64Url() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.stringBase64); //NOSONAR
  }

  handleImg($event: any) {
    this.aux = $event;
    this.stringBase64 = 'data:image/png;base64, ' + this.aux.checkImg;
    if (this.stringBase64 != null) {
      this.existsImage = true;
    }
  }

  getDate2Str(fecha: Date): string {
    let returnDate = '';
    if (fecha != null) {
      let diaSt = '';
      let mesSt = '';
      let today = new Date();
      today = fecha;
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear().toString();
      if (dd < 10) {
        diaSt = `0${dd}`;
      } else {
        diaSt = `${dd}`;
      }
      if (mm < 10) {
        mesSt = `0${mm}`;
      } else {
        mesSt = `${mm}`;
      }
      returnDate = diaSt + '/' + mesSt + '/' + yyyy;
    }
    return returnDate;
  }
  handleAccountChanged($event: any) {
    this.accountSelected = $event;
    this.informationModel.accountNro =
      this.accountSelected != null ? this.accountSelected.number : '';
  }
  handleChangeDP(event: any): void {
    this.showError = false;
    this.DateCheck = event;
    this.DateCheckStr = this.getDate2Str(this.DateCheck);
    this.informationModel.regDate = this.DateCheckStr;
  }
}
