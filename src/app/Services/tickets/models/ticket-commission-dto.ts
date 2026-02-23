export class TicketCommissionDto {
    amount!: number;
    commissionCharge!: string;
    ticket!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
