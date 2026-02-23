export class CreSaguapacDebt {
    name!: string;
    code!: string;
    description!: string;
    detail!: {
        id: number;
        documentNumber: string;
        period: string;
        amount: number;
        selected: any;//aumentado
    }[];
}
