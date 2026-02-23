export class ElfecDebtResult {

    nus!: string;
    accountNumber!: string;
    totalConsumption!: number;
    totalGeneral!: number;
    isBill!: boolean;
    bill!: Blob[];
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
    rejectionCause!: string;
    operationStatusId!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
