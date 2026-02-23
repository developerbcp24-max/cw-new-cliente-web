export class TicketCommissionResult {
    application!: string;
    responseCode!: number;
    othersCommission!: number;
    ourCommission!: number;
    percentageCommission!: number;
    porteCommission!: number;
    totalCommission!: number;
    usdEquivalent!: number;
    state!: string;
    date!: Date;
    convertedAmount!: number;
    originalAmount!: number;
    entry!: number;
    currency!: string;
    responseMessage!: string;
    ticket!: string;
    exchangeRate!: number;
    currencyExchangeRate!: number;
    operationExchangeRate!: number;
    operationType!: string;
    sendingType!: string;
    user!: string;

    constructor(values: Object = {}) {
        this.ticket = '';
        Object.assign(this, values);
    }
}
