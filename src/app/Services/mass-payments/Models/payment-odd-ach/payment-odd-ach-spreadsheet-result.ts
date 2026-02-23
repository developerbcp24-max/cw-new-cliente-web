export class PaymentOddAchSpreadsheetResult {
  operationStatusId?: number;
  description?: string;
  line!: number;
  targetAccount!: string;
  amount!: number;
  typeIdc!: any;
  idc!: string;
  extensionIdc!: any;
  destinationBranchOfficeId!: number;
  serviceCode!: string;
  mail!: string;
  banksAchCode!: string;
  bankDescription!: string;
  flagFutureDate!: boolean;
  futureDate!: Date;
  glossDeposit?: string;
  isChecked?: boolean;
  typeOfLoad?: string;
  isDeleted?: boolean;
  isEdit?: boolean;
  businessName!: string;
  branchOfficeDescription!: string;
  banksName!: string;
  isError!: boolean;
  errorMessages!: string;

  constructor(values: Object = {}) {
      Object.assign(this, values);
  }
}



