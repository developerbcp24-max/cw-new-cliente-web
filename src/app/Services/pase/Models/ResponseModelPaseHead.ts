export class ResponseModelPaseHead {
    codeService!: string;
    tradeName!: string;
    totalAmount!: number;
    numberCounts!: string;
    currencyCurrentAccount!: string;
    currencyDescriptionCuts!: string;
    currencyDescriptionTalks!: string;
    codeCollector!: string;
    codeCompany!: string;      
    registrationAmount!: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
      
}
