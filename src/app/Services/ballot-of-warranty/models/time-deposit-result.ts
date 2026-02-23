export class TimeDepositResult {
    longDescription!: string;
    shortDescription!: string;
    code!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
