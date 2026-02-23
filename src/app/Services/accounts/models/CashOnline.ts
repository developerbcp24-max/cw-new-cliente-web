export class CashOnline {
    value!: string;
    name!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
