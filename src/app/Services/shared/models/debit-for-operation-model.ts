export class DebitForOperationModel {
    isMultipleDebit!: boolean;
    operationNumberDebitHost!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
