export class ProvidersDepositInOtherBankCheckSpreadsheetsResult {
    code!: number;
    line!: number;
    destinationAccount!: string;
    amount!: number;
    beneficiaryReason!: string;
    instructions!: string;
    detail!: string;
    bank!: string;
    bankDescription!: string;
    emailProvider!: string;
    isError!: boolean;
    errorMessages!: string;
    isEdit?: boolean;
    type?: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
