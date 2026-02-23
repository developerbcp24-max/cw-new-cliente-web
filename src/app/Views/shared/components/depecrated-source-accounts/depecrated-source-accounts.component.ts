import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { DepecratedMyAccountsComponent } from '../depecrated-my-accounts/depecrated-my-accounts.component';

@Component({
  selector: 'app-depecrated-source-accounts',
  standalone: false,
  templateUrl: './depecrated-source-accounts.component.html',
  styleUrls: ['./depecrated-source-accounts.component.css']
})
export class DepecratedSourceAccountsComponent implements OnInit {

  isOverdraftBalance: boolean;
  accountSelected: AccountResult = new AccountResult();
  @Input() companyAccounts!: boolean;
  @Input() selectedAccountId: number;
  @Input() accountRequest: AccountDto = new AccountDto();
  @Input() disabled: boolean;
  @Input() showBalances = true;
  @Input() showFlag = true;
  @Input() loadFirstAccount = true;
  @Output() onChange = new EventEmitter();
  @Input() defaultAccount: number = 0;
  @Input() isAwait: boolean = false;
  @ViewChild(DepecratedMyAccountsComponent) sourceComponent!: DepecratedMyAccountsComponent;
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
}

