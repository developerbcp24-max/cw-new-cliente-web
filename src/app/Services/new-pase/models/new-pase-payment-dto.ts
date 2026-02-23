export class NewPasePaymentDto {
    line!: number;
    clientName!: string;
    serviceCode!: string;
    parameters!: string;
    parametersDetail?: string;
    paymentDetailId!: string;
    descriptionPayment!: string;
    detailDescription!: string;
    numberQuote!: number;
    amount!: number;
    companyCode!: string;
    phoneNumber?: string;
    email?: string;
    billingType?: string;
    documentExtension?: string;
    iDCComplement?: string;
    documentNumber?: string; 
    documentType?: any;
    paymentInformation: Array<string> = [];
    information?: string;
    period!: string;
    departament?: string;
    nus?: string;
    account?: string;
    IsGenericPayment?: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}