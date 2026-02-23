export class RequesterAbroadData {
    address!: string;
    phone!: string;
    numberAccount!: string;
    destinationAmount!: number;
    isTicket!: boolean;
    ticket!: number;
    preferentialExchange!: number;
    ticketCommission!: string;
    commissionAmount!: string;
    commissionOur!: string;
    currency!: string;
    charge!: string;
    isTicketCommission!: boolean;
    ticketOtherCurrency!: string;
    email!: string;
    transferReason!: string;
    isDiferentCurrency!: boolean;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
