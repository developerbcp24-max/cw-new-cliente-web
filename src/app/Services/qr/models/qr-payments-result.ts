export class QrPaymaentsResult {
    line!: number;
    city!: string;
    email!: string;
    ProcessBatchId!: number;
    accountNumber!: string;
    gloss!: string;
    expiration?: string;
    stock?: string;
    currency!: any;
    documentNumber?: string;
    branchOffice?: string;
    branchOfficeId?: number;
    expirationCode?: string;
    cityDescription?: string;
    expirationDescription?: string;
    amount?: number;
    firstDetail?: string;
    secondDetail?: string;
    sendEmail?: boolean;
    telephoneNumber?: string;
    operationStatusId?: number;
    description?: string;
    idcComplement?: string;
    errorMessages?: string;
    isEdit = false;
    isError = false;
    atmName!: string;
    atmCode!: number;
    branchCode: number = 0;
    branchName: string = '';
    businessCode: number = 0;
    abreviation: string = "";
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }