export class CreditCardsAccountResult {
    Id!: number;
    accountNumber!: string;
    userName!: string;
    currency!: string;
    creditLine!: number;
    availableBalance!: number;
    amountUsed!: number;
    quotaDate!: string;
    quotaAmount!: number;
    typeAccount!: string;
    estateAccount!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
