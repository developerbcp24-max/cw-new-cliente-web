import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BalancesResult } from '../../../../Services/balances-and-movements/models/balances-result';
import { Constants } from '../../../../Services/shared/enums/constants';

@Component({
  selector: 'app-total-balances',
  standalone: false,
  templateUrl: './total-balances.component.html',
  styleUrls: ['./total-balances.component.css']
})

export class TotalBalancesComponent implements OnInit, OnChanges {

  @Input() numberAccounts!: number;
  @Input() totalBalances: BalancesResult[] = [];
  constants!: Constants;
  totalUsd!: number;
  totalBol!: number;
  constructor() {/*This is intentional*/ }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(): void {
    if (this.totalBalances.length > 0) {
      this.totalBalances.forEach(element => {
        if (element.currency === Constants.currencyUsd) {
          this.totalUsd = element.availableBalance;
        }
        if (element.currency === Constants.currencyBol) {
          this.totalBol = element.availableBalance;
        }
      });
    }
  }

}
