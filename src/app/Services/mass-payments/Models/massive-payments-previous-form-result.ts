export class MassivePaymentsPreviousFormResult {
    id!: number;
    operationTypeId!: number;
    description!: string;
    accountNumber!: string;
    amount!: number;
    currency!: string;
    dateForm!: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
