export class ElfecPaymentDto {
    totalConsumption!: number;
    totalGeneral!: number;
    queryCode!: string;
    companyCode!: string;
    serviceCode!: string;
    amount!: number;
    clientName!: string;
    companyName!: string;
    address!: string;
    trace!: string;
    expirationDate!: Date;
    quotaNumber!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
