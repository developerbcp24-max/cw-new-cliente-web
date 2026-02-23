import { AccountResult } from './account-result';
import { BalancesResult } from './balances-result';
export class AccountBalancesResult {
    account!: AccountResult;
    Movements!: BalancesResult[];
}
