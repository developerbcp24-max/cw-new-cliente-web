export class CompleteAccountResult {
    id!: number;
    number!: string;
    type!: string;
    application!: string;
    originState!: string;
    currency!: string;
    name!: string;
    formattedNumber!: string;
    accountUse!: string;
    entryType!: string;
    companyId!: number;
    state!: boolean;
    isAuthorizerControl!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
