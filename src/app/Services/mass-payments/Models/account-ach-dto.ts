export class AccountAchDto {
    accountNumber!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
