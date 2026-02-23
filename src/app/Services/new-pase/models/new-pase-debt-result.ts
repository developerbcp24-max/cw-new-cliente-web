export class NewPaseDebtResult {
    processBatchId!: number;
    line!: number;
    companyCode!: string;
    serviceCode!: string;
    parameters!: string;
    paymentDetailId!: string;
    clientName!: string;
    descriptionPayment!: string;
    detailDescription!: string;
    numberQuote!: number;
    amount!: number;
    paymentInformation!: string;
    isComission!: boolean;
    comissionAmount!: number;
    comissionCurrency!: string;
    isStreet!: boolean;
    isBill!: boolean;
    billPayment!: Blob;
    rejectionCause!: string;
    operationStatusId!: number;
    address!: string;
    isGenericPayment!: boolean;
    information!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}