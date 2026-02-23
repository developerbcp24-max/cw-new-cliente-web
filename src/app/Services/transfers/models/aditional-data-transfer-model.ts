export class AditionalDataTransferModel {
    isDateFuture!: boolean;
    isPreferentialTicket!: boolean;
    futureDate!: string;
    ticket!: string;
    isSendVouchers!: boolean;
    sendVouchers!: string[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
