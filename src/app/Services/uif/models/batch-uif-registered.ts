export class BatchUIFRegistered {
    processBatchId!: number;
    errorMessage!: string;
    originFunds!: string;
    destinationFunds!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
