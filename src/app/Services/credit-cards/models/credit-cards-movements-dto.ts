export class CreditCardsMovementsDto {
    numberAccount!: string;
    initialDate!: Date;
    endDate!: Date;
    initialDateSample!: Date;
    endDataSample!: Date;
    currentBalance!: number;
    userName!: string;
    accountCardNumber!: string;
    typeAccountCard!: string;
    estateAccountCard!: string;
    currency!: string;
    availableBalance!: number;
    companyName!: string;
    totalDebit!: number;
    totalCredit!: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
