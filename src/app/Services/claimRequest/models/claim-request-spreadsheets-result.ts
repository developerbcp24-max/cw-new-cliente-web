export class ClaimRequestSpreadsheetsResult {
    productName!: string;
    productId!: string;
    accountNumber!: string;
    cardNumber!: string;
    claimType!: string;
    serviceName!: string;
    transactionDate!: string;
    transactionTime!: string;
    descriptionClaim!: string;
    userId!: number;
    state!: string;
    numberCaseSarc!: string;
    branchOffice!: string;
    agency!: string;
    serviceId!: string;
    amountClaim!: number;
    currencyClaim!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
