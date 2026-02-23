export class MovementDepositBasicRequestModel {
    id!: number;
    transactionId!: number;
    channel!: string;
    description!: string;
    sequence!: number;
    sourceNIT!: string;
    accountNameEnterpriseOriginal!: string;
    registrationNumber!: string;
    amountDeposit!: number;
    destCurrency!: string;
    comment!: string;
    lotDateProcess!: string;
    amountLot!: number;
    currencyLot!: string;
    accountFormOriginal!: string;
    operationName!: string;
    destinationAccount!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

