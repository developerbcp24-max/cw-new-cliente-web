export class ServicesPasePaymentDto {
    totalConsumption!: number;
    totalGeneral!: number;
    queryCode!: string;
    companyCode!: string;
    serviceCode!: string;
    serviceCodeDescription!: string;
    amount!: number;
    clientName!: string;
    companyName!: string;
    information!: string;
    address!: string;
    trace!: string;
    expirationDate!: string;
    quotaNumber!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
