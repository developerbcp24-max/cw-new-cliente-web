export class ElfecDebt {
    totalConsumption!: number;
    totalGeneral!: number;
    queryCode!: string;
    companyCode!: string;
    serviceCode!: string;
    clientName!: string;
    companyName!: string;
    trace!: string;
    detail!: {
        quotaNumber: number;
        amount: number;
        expirationDate: Date;
        message: string;
    }[];
}

