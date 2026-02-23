export class CreditCardsMovementsResult {
    totalDebit!: number;
    totalCredit!: number;
    dateMovement!: string;
    glossMovement!: string;
    typeMovement!: string;
    amountMovement!: number;
    balanceMovement!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
