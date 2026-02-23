export class FavoriteTransactionDto{
     Id: number=0;
     OperationTypeId: number =0;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
