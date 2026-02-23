export class MovementDepositM {
    id!: number;
    transactionId!: number;
    channel!: string;
    operationDescription!: string;
    originalAccount!: string;
    nameOrigin!: string;
    documentNumber!: string;
    amount!: number;
    currency!: string;
    destinationAccount!: string;
    dateDeposit!: string;
    timeDeposit!: string;
    dateLoad!: string;
    sequenceNumber!: number;
    registrationNumber!: string;
    functionary!: string;
    workstationId!: string;
    sequence!: string;
    causal!: string;
    mnemonic!: string;
    branchOffice!: string;
    cashier!: string;
    comment!: string;
    amountRequested!: string;
    currencyRequested!: string; 
    exchangeACH!: number;
    exchangeBuy!: number;
    exchangeSale!: number;
    originatingNumber!: string;
    sourceCodeBranchOffice!: string;
    camera!: string;
    sourceBank!: string;
    description!: string;
    sourceNIT!: string;
    commission!: number;
    ticket!: string;
    hostNumber!: string;
    dateInitial!: string;
    dateEnd!: string;
    operationTypes!: number;
    numPag!: number;
    quantityData!: number;
    companyName!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
