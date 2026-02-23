export class RatesDto {
    amount!: number;
    currency!: string;
    warrantyType!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
