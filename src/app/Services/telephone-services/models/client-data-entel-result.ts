export class ClientDataEntelResult {
    accountNumber!: string;
    name!: string;
    description!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}