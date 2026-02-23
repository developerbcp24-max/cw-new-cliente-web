export class TicketOtherCurrencyDto {
    ticket!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
