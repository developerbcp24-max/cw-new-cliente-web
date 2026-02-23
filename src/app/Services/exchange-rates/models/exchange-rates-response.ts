export class ExchangeRatesResponse {
    date!: string;
    purchase!: number;
    sale!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}