export class ProvidersCheckManagementSpreadsheetsResult {
    code!: number;
    line!: number;
    amount!: number;
    beneficiaryReason!: string;
    instructions!: string;
    placeDelivery!: string;
    detail!: string;
    emailProvider!: string;
    isError!: boolean;
    errorMessages!: string;
    isEdit?: boolean;
    type?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
