export class AccountIdDto {
    accountId!: number;
    reportType!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
