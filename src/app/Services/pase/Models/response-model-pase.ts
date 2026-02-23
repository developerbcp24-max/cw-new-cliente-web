export class ResponseModelPaseAccount {
    public name!: string;
    public numberAccount!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}


