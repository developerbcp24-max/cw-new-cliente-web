export class LimitsResult {
    companyLimit!: number;
    authorizerLimit!: number;
    available!: number;
    spentMoney!: number;
    authorizedLimit!: number;
    bolsCompany!: number;
    dollarsCompany!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
