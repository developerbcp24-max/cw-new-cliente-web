export class TicketDto {
    amount!: number;
    sourceCurrency!: string;
    destinationCurrency!: string;
    number?: string;
    isExteriorTransfer!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
