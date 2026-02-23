export class CheckListDto {
    accountNro!: string;
    regDate!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
