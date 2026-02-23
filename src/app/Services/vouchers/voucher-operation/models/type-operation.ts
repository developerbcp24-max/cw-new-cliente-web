export class TypeOperation {
    id!: number;
    nameTypeOperation!: string;
    operationTypeDes!: string;
 constructor(values: object = {}) {
    Object.assign(this, values);
    }
}
