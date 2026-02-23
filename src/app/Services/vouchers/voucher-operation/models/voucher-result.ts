export class VoucherResult {
    id!: number;
    userCreationId!: number;
    operationTypeId!: number;
    sourceAccount!: string;
    formattedAccount!: string;
    amount!: number;
    currency!: string;
    dateCreation!: Date;
    nameOperation!: string;
    operationTypeDes!: string;
    statusCode!: string;
    state!: string;
    transferTypeId!: number;
    isBill!: boolean;
    totalItems!: number;
    ebsTransactionNumber!: string;
    isVisibleEBSNumber!: boolean;
    isVisibleButton: boolean = false;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
