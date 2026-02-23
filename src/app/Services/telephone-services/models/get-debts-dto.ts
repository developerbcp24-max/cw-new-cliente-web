export class GetDebtsDto {
    accountNumber!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}