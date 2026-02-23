export class CurrencyAndAmount {
    amount!: number;
    currency: string = '';
    fundSource!: string;
    fundDestination!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
