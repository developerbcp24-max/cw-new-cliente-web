export class ServicesResult {
    companyCode!: string;
    serviceCode!: string;
    nameCompany!: string;
    accountNumber!: string;
    isOnline!: boolean;
    currency!: string;
    sft!: string;
    typeSFT!: string;
    validationType!: string;
    validation!: string;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
