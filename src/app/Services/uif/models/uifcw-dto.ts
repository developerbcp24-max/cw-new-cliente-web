export class UifcwDto {
    accountNumber!: string;
    causalTransaction!: string;
    amount!: number;
    currency!: string;
    exchangeRate!: number;
    typeTransaction!: string;
    fundSource!: string;
    fundDestination!: string;
    description!: string;
    errorMessage!: string;
    processBatchId?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
