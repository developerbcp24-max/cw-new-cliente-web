export class SalariesPaymentsSpreadsheetsResult {
  line!: number;
  amount!: number;
  accountNumber!: string;
  gloss!: string;
  documentType!: any;
  documentNumber!: string;
  documentExtension!: any;
  titular!: string;
  firstDetail!: string;
  secondDetail!: string;
  sendEmail!: boolean;
  email!: string;
  operationDebitHost!: string;
  operationMDPMId!: string;
  telephoneNumber!: string;
  operationStatusId!: number;
  description!: string;
  idcComplement!: string;
  isEdit = false;
  isError = false;
  errorMessages!: string;
  operationStatus!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
