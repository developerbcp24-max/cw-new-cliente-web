export class CashPaymentsSpreadsheetsResult {
    code!: number;
    amount!: number;
    line!: number;
    description!: string;
    name?: string;
    firstLastName!: string;
    secondLastName!: string;
    documentType!: string;
    documentNumber!: number;
    documentExtension!: any;
    instruccionsPayment!: string;
    branchOfficeId!: string;
    branchOfficeDescription!: string;
    details!: string;
    mail!: string;
    isEdit?: boolean;
    isError!: boolean;
    errorMessages!: string;
    operationStatusDescription!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
