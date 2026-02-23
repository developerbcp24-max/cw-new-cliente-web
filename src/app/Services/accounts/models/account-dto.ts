export class AccountDto {
    accountUse!: string;
    roleId?: number;
    operationTypeId?: number[];
    types!: string[];
    applicationTypes?: string[];
    currencies?: string[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
