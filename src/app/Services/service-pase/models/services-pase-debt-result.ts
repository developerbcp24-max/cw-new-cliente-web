export class ServicesPaseDebtResult {
    id!: number;
    parameters!: string;
    totalConsumption!: number;
    totalGeneral!: number;
    isBill!: boolean;
    queryCode!: string;
    companyCode!: string;
    serviceCode!: string;
    serviceCodeDescription!: string;
    amount!: string;
    clientName!: string;
    companyName!: string;
    information!: string;
    trace!: string;
    expirationDate!: string;
    quotaNumber!: number;
    rejectionCause!: string;
    operationStatusId!: number;

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
