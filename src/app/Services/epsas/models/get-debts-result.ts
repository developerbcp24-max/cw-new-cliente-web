export class GetDebtsResult {
    totalConsumption!: number;
    totalGeneral!: number;
    queryCode!: string;
    companyCode!: string;
    serviceCode!: string;
    serviceCodeDescription!: string;
    clientName!: string;
    companyName!: string;
    trace!: string;
    quotas: PaymentQuotas[] = [];
    }

export class PaymentQuotas {
    quotaNumber!: number;
    amount!: number;
    isExpirationDate!: boolean;
    expirationDate!: Date;
    message!: string;
    selected: any; //aumentado
}
