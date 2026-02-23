export class FavoriteTransferResponse {
    sourceAccountId!: number;
    destinationAccountNumber!: string;
    amount!: number;
    currency!: string;
    name!: string;
    id!: number;
    isAch!: boolean;
    bank!: string;
    bankId!: string;
    branchOfficeId!: string;
    branchOffice!: string;
    beneficiary!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
