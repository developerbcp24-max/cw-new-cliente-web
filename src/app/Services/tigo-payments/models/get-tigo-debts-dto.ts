export class GetTigoDebtsDto {
    accountNumber!: string;
    searchCode!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}