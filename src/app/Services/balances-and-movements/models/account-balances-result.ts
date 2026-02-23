import { AccountResult } from './account-result';
import { BalancesResult } from './balances-result';

export class AccountBalancesResult {
    accounts!: AccountResult[];
    totalBalances!: BalancesResult[];
}


