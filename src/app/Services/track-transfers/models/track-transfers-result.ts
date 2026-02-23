export class TrackTransfersResult {
    id!: number;
    name!: string;
    operationTypeId!: number;
    accountId!: number;
    formattedAccount!: string;
    amount!: number;
    currency!: string;
    dateCreation!: Date;
    dateProcess!: Date;
    description!: string;
    isAuth!: boolean;
    isCtrl!: boolean;
    isScheduledProce!: boolean;
    scheduledProcess!: Date;
    beneficiary!: string;
    isAuthorizerControl!: boolean;
    isSignerScheme!: boolean;
    isContract!: boolean;
    totalItems!: number;
    ebsTransactionNumber!: string;
    isVisibleEBSNumber!: boolean;
    isVisibleButton: boolean = false;
    isScheduledProcess: any
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
