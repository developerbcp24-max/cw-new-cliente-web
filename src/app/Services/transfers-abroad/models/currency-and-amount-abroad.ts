export class CurrencyAndAmountAbroad {
    amountTransfer!: number;
    currencyTransfer!: string;
    amountDestiny!: number;
    currencyDestiny!: string;
    description!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
