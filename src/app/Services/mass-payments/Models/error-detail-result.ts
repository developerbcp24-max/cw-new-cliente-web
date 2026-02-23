export class ErrorDetailResult {
    line!: number;
    messageError!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
