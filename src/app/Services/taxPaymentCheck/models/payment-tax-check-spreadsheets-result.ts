export class PaymentTaxCheckSpreadsheetsResult {
    code!: number;
    line!: number;
    amount!: number;
    socialReason!: string;
    numberTransact!: string;
    typeDocument!: string;
    document!: string;
    extensionDocument?: any;
    addressDelivery!: string;
    email!: string;
    isError!: boolean;
    errorMessages!: string;
    isEdit?: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
