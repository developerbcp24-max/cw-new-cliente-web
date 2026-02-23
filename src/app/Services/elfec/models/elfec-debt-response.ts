export class ElfecDebtResponse {
    totalConsumption!: number;
    totalGeneral!: number;
    queryCode!: string;
    companyCode!: string;
    serviceCode!: string;
    clientName!: string;
    companyName!: string;
    trace!: string;
    quotas: PaymentQuotas[] = [];
}

export class PaymentQuotas {
    quotaNumber!: number;
    amount!: number;
    expirationDate!: Date;
    message!: string;
    selected!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
