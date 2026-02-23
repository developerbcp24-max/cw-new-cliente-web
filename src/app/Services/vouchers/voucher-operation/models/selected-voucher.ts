export class SelectedVoucher {
    id!: number;
    operationTypeId!: number;
    nameOperation!: string;
    typeVoucher!: number;
    operationTypeDes!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
