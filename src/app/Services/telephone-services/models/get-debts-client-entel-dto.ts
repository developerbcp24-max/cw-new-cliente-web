export class GetDebtsClientEntelDto {
    searchCode!: string;
    parameters!: string;
    paymentType!: string;
    paymentTypeDescription!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}