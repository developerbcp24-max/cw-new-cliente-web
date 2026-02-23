export class GetBatchDto {
    id!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
