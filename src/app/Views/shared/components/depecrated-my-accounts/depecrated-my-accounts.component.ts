import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccountsService } from '../../../../Services/accounts/accounts.service';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { BalancesAndMovementsService } from '../../../../Services/balances-and-movements/balances-and-movements.service';
import { AccountIdDto } from '../../../../Services/balances-and-movements/models/account-id-dto';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { DataService } from '../../../../Services/shared/data.service';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-depecrated-my-accounts',
  standalone: false,
  templateUrl: './depecrated-my-accounts.component.html',
  styleUrls: ['./depecrated-my-accounts.component.css'],
  providers: [AccountsService, BalancesAndMovementsService]
})
export class DepecratedMyAccountsComponent implements OnInit, OnChanges {

  accounts: AccountResult[] = [];
  accountSelected: AccountResult = new AccountResult();
  @Output() onChange = new EventEmitter<AccountResult>();
  @Input() returnBalances = false;
  @Input() companyAccounts = false;
  @Input() accountRequest!: AccountDto;
  @Input() selectedAccount = 0;
  @Input() loadFirstAccount = true;
  @Input() defaultAccount = 0;
  @Input() isAwait:boolean = false;

  constructor(private accountService: AccountsService, private balancesAndMovementsService: BalancesAndMovementsService,
    private globalService: GlobalService, private dataService: DataService) { }

  ngOnInit() {
    if (!this.isAwait) {
      this.getAccounts();
    }
  }

  getAccounts() {
    if (this.companyAccounts) {
      this.accountService.getCompanyAccounts(this.accountRequest)
        .subscribe({next: response => this.parseAccount(response)});
    } else {
      this.accountService.getAccounts(this.accountRequest)
        .subscribe({next: response => this.parseAccount(response)});
    }
  }

  parseAccount(response: AccountResult[]) {
    this.accounts = response;
    if (response.length > 0) {
      if (this.defaultAccount > 0) {
        this.accountSelected = this.accounts.find(x => x.id.toString() === this.defaultAccount.toString())!;
        this.getBalance(this.accountSelected);
        this.onChange.emit(this.accountSelected);
      } else {
        if (this.loadFirstAccount) {
          this.accountSelected = this.accounts[0];
          this.getBalance(this.accountSelected);
        } else {
          this.accountSelected = null!;
        }
      }
    } else {
      this.dataService.noAccounts = true;
    }
    this.onChange.emit(this.accountSelected);
  }

  ngOnChanges(changes: any) {
    setTimeout(() => {
      if (changes.defaultAccount !== undefined && !changes.defaultAccount.isFirstChange()) {
        this.accountSelected = this.accounts.find(x => x.id.toString() === changes.defaultAccount.currentValue.toString())!;
        this.handleAccountChanged();
      }
    });
  }

  handleAccountChanged() {
    if (this.accountSelected) {
      this.getBalance(this.accountSelected);
      this.onChange.emit(this.accountSelected);
    }
  }

  setAccount(accountId: string) {
    this.accountSelected = this.accounts.find(x => x.id.toString() === accountId)!;
    this.getBalance(this.accountSelected);
    this.onChange.emit(this.accountSelected);
  }

  getBalance(account: any) {
    const accountId: AccountIdDto = new AccountIdDto({ accountId: account.id });
    if (this.returnBalances) {
      this.balancesAndMovementsService
        .getAccountBalancesById(accountId)
        .subscribe({next: (response: AccountResult) => {
          this.accountSelected.availableBalance = response.availableBalance;
          this.accountSelected.overdraftAmount = response.overdraftAmount;
          this.accountSelected.overdraftBalance = response.overdraftBalance;
        }, error: _err => {
          this.globalService.warning('Saldos y movimientos', _err.message);
          this.accountSelected.balanceErrorMessage = _err.message;
        }});
    }
  }
}
