export class BalancesResult {
    currency!: string;
    availableBalance!: number;
    accountingBalance!: number;
    inProgressOperations!: number;
    withholding!: number;
    position!: number;
}