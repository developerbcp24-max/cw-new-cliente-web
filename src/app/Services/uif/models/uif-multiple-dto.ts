export class UifMultipleDto {
    amountHab!: number;
    amountProv!: number;
    amountEfe!: number;
    amountAch!: number;
    accountNumber!: string;
    currency!: string;
    exchangeRate!: number;
    errorMessage!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
