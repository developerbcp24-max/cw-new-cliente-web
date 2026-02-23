export class EpsasPaymentDto {
    clientName!: string;
    account!: string;
    operativeDate!: number;
    numberOperation!: number;
    service!: number;
    measurer!: string;
    customerReference!: string;
    address!: string;
    nitBill!: string;
    billName!: string;
    number!: string;
    dependencyItem!: string;
    description!: string;
    wayToPay!: string;
    currency!: string;
    amount!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}