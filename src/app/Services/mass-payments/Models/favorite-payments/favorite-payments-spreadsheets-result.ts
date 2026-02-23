export class FavoritePaymentsSpreadsheetsResult {
    id!: number;
    processBatchId!: number;
    companyId!: number;
    code!: string;
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
    commission!: string;
    commissionCurrency!: string;
    telephoneNumber!: string;
    isEdit?: boolean;
    typeOfLoad?: string;
    isChecked?: boolean;
    operationStatusId?: number;
    isDeleted?: boolean;
    status!: boolean;
    isError!: boolean;
    errorMessages!: string;
    isNew!: boolean;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
