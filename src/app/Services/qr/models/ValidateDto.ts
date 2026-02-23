export class ValidateDto {
    operationTypeId?: number[];
    type!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
