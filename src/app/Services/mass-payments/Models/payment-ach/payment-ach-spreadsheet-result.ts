export class PaymentAchSpreadsheetResult {
  description?: string;
  line!: number;
  targetAccount!: string;
  amount!: number;
  beneficiary!: string;
  beneficiaryValidado!: string;
  documentType!: string;
  documentNumber!: string;
  documentExtension!: string;
  operationStatusId?: number;
  mail = '';
  banksAchCode!: string;
  branchOfficeId!: number;
  details!: string;
  isChecked?: boolean;
  typeOfLoad?: string;
  isDeleted?: boolean;
  isEdit?: boolean;
  branchOfficeDescription!: string;
  bankDescription!: string;
  isError!: boolean;
  errorMessages!: string;
  validMessage!: string;
  bankAlias!: string;
  operationStatusDescription!: string;
  processMessage:string ='';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}



