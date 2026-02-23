export class ResponseModelsAfpquery {
    codeauthorization!: string;
    codeAnswer!: string;
    detailAnswer!: string;
    detail!: PaymentAFP;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class PaymentAFP {
    nameAFP!: string;
    periodAFP!: string;
    spreadsheetsAFP!: string;
    documentNumber!: string;
    documentType!: string;
    detailDpaymentAFP: DetailAFPDto[] = [];
    amountTotal!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}

export class DetailAFPDto {
    amounts!: number;
    TypeContribution!: string;
    accountNumberAFP!: number;
    expirationDate!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}