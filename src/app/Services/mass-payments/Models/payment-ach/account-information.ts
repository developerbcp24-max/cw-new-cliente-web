export class AccountInformation {
  number!: string;
  beneficiary!: string;
  bank!: string;
  branchOffice!: string;
  branchOfficeDescription!: string;
  bankDescription!: string;

  documentType!: string;
  documentNumber!: string;
  documentExtension!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
