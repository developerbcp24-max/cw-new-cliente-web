export class GetClientResponse {
    numberAccount!: string;
    amount!: number;
    name!: string;
    accountType!: string;
    payment!: string;
    paymentDescription!: string;
    service!: string;
    serviceDescription!: string;
    serviceName!: string;
    idTransaction!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}