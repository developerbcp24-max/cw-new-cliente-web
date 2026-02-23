export class AccountResult {
    id!: number;
    number!: string;
    formattedNumber!: string;
    currency!: string;
    application!: string;
    type!: string;
    isAuthorizerControl!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
