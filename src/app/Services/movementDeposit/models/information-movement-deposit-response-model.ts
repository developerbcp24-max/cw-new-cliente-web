export class InformationMovementDepositResponseModel {
    dateInitial!: Date;
    dateEnd!: Date;
    operationTypes!: number;
    account!: string;
    numPag!: number;
    quantityData!: number;
    type!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
