export class MassivePaymentsSpreadsheetsDto {
    id!: number;
    paymentType?: string;
    operationTypeId!: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
