export class SoliPaymentsSpreadsheetsResult {
    line!: number;
    amount!: number;
    accountNumber!: string;
    gloss!: string;
    documentType!: any;
    documentNumber!: string;
    documentExtension!: string;
    serviceCode!: string;
    companyCode!: string;
    paymentDetailId!: string;
    titular!: string;
    detail!: string;
    sendEmail!: boolean;
    mail!: string;
    paymentInformation: Array<string> = [];
    isError = false;
    errors!: string;
    errorMessages!: string;
    operationDebitHost!: string;
    operationMDPMId!: string;
    telephoneNumber!: string;
    operationStatusId!: number;
    description!: string;
    idcComplement!: string;
    isEdit = false;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
  