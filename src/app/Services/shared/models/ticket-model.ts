import { TicketResult } from '../../tickets/models/ticket-result';

export class TicketModel {
    isTicketSelected!: boolean;
    ticket!: TicketResult;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
