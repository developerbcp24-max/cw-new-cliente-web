export class CreditCardsAccountByIdDto {
    accountId!: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
