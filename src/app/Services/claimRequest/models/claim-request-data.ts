
export class ClaimRequestData {
    accountUse!: string;
    roleId!: number;
    operationTypeId!: number;
    types!: string[];
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
