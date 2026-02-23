export class PaymentAfpDetailDto {
    processBatchId!: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
