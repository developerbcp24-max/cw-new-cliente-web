export class FavoriteTransferRequest {
    id?: number;
    sourceAccountId!: number;
    destinationAccountNumber!: string;
    amount!: number;
    currency!: string;
    name!: string;
}
