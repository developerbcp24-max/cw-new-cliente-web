export class CompanyDataResult {
    name!: string;
    documentNumber!: string;
    documentType!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

