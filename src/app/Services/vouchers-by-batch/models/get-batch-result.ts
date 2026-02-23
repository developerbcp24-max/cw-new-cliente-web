export class GetBatchResult {
    id!: number;
    userCreationId!: number;
    operationTypeId!: number;
    nameOperation!: string;
    sourceAccount!: string;
    formattedAccount!: string;
    beneficiary!: string;
    isMultipleDebits!: boolean;
    amount!: number;
    Currency!: string;
    State!: string;
    dateCreation!: Date;
    dateInit!: Date;
    dateEnd!: Date;
    transferTypeId!: number;
    isBill!: boolean;
    bill!: Blob;
    totalItems!: number;
    ebsTransactionNumber!: string;
    isVisibleEBSNumber!: boolean;
    isVisibleButton: boolean = false;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
