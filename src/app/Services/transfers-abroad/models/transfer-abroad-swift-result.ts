export class TransferAbroadSwiftResult {
    processBatchId!: number;
    referenceSender!: string;
    accountFormatted!: string;
    beneficiary!: string;
    currency!: string;
    operationAmount!: number;
    operationDate!: Date;
    operationNumber!: string;
}

export class TransferAbroadSwiftListResult {
    totalItems!: number;
    currentPage!: number;
    pageSize!: number;
    transfersAbroadSwiftResult: TransferAbroadSwiftResult[] = [];
}
