export class ProcessBatchDetailResult {
    operationTypeId!: number;
    accountId!: number;
    sourceAccount!: string;
    amount!: number;
    currency!: string;
    description!: string;
    isScheduledProcess!: boolean;
    scheduledProcess!: Date;
    isMultipleDebit!: boolean;
    operationNumberDebitHost!: string;
    isTicket!: boolean;
    numberTicket?: number;
    preferentialExchange!: number;
    indicatorBuyOrSale!: string;
    operationStatusId!: number;
    exchangeSale!: number;
    exchangeBuy!: number;
}
