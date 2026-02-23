export class AccountClientDto {
    accountNumber!: string;
    documentType!: string;
    documentNumber!: string;
    documentExtension!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
