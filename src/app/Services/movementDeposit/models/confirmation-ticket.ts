export class ConfirmationTicket {
    companyId!: number;
    userDetailId!: number;
    existUser!: boolean;
    containContract!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
