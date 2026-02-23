export class MultiplePaymentSpreadsheetsResult {
    multiplePaymentId!: number;
    paymentType!: string;
    line!: number;
    accountNumber!: string;
    titularName!: string;
    firstLastName!: string;
    secondLastName!: string;
    description!: string;
    glossPayment!: string;
    amount!: number;
    accountType!: string;
    documentType!: any;
    documentNumber!: string;
    documentExtension!: any;
    branchOfficeId!: number;
    branchOfficeDescription!: string;
    firstDetail!: string;
    secondDetail!: string;
    mail!: string;
    instruccionsPayment!: string;
    bankId!: string;
    bankDescription!: string;
    commission!: number;
    commissionCurrency!: string;
    telephoneNumber!: string;
    isEdit?: boolean;
    isFail?: boolean;
    isDelete?: boolean;
    isError = false;
    errorMessages!: string;
    providerId!: string;
    ebsTransactionNumber!: string;
    operationSatatusId: number =0;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
