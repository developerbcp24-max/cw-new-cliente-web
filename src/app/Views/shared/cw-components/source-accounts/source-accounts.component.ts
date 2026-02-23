import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
/* import { AccountDto } from 'src/app/Services/accounts/models/account-dto';
import { AccountResult } from 'src/app/Services/balances-and-movements/models/account-result';
import { GlobalService } from 'src/app/Services/shared/global.service'; */
import { MyAccountsComponent } from '../my-accounts/my-accounts.component';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-source-accounts',
  standalone: false,
  templateUrl: './source-accounts.component.html',
  styleUrls: ['./source-accounts.component.css']
})
export class SourceAccountsComponent implements OnInit {

  isOverdraftBalance: boolean;
  accountSelected: AccountResult = new AccountResult();
  @Input() accountDropLabel = 'Cuenta origen';
  @Input() companyAccounts!: boolean;
  @Input() accountType = '';
  @Input() selectedAccountId: number;
  @Input() accountRequest: AccountDto = new AccountDto();
  @Input() disabled: boolean;
  @Input() showBarRoute = true;
  @Input() showBalances = true;
  @Input() showDetails = true;
  @Input() showFlag = true;
  @Input() loadFirstAccount = true;
  @Output() onChange = new EventEmitter();
  @Input() defaultAccount = 0;
  @Input() isAwait = false;
  @Input() isOnlyRead = false;
  @Input() onlyCurrencyBOL = false;
  @ViewChild(MyAccountsComponent) sourceComponent!: MyAccountsComponent;
  @ViewChild('sourceAccountForm') form!: NgForm;

  constructor(private globalService: GlobalService) {
    this.selectedAccountId = 0;
    this.disabled = false;
    this.isOverdraftBalance = false;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  handleAccountChanged($event: any) {
    this.accountSelected = $event;
    this.onChange.emit(this.accountSelected);
    this.isOverdraftBalance = this.accountSelected.overdraftAmount! < 0;
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.showBalances && Number.isNaN(+this.accountSelected.availableBalance)) {
      return false;
    }
    return this.form.valid;
  }

  restart() {
    this.sourceComponent.getAccounts();
  }
}
