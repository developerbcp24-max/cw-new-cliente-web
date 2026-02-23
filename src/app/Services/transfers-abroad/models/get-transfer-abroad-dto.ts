export class GetTransferAbroadDto {
    batch!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
