export class CheckDto {
    idCheck!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
