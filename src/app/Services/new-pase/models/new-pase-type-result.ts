export class NewPaseTypeResult {
    code!: number;
    description!: string;
    categoryCode!: string;
    operationTypeId!: number;
    isDeleted!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}