export class AccountProviderDto {
    accountNumber!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
