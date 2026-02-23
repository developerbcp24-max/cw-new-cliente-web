export class CashPaymentsInLineSpreadsheetsResult {
    code!: number;
    amount!: number;
    line!: number;
    description!: string;
    name!: string;
    firstLastName!: string;
    secondLastName!: string;
    documentType!: string;
    documentNumber!: number;
    documentExtension!: any;
    instructions!: string;
    branchOfficeId!: string;
    branchOfficeDescription!: string;
    detail!: string;
    mail!: string;
    isEdit?: boolean;
    isError!: boolean;
    errorMessages!: string;
    addressBeneficiary!: string;
    codeBeneficiary!: string;
    operationStatus!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}