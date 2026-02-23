export class ClaimDepartment {
    code!: string;
    value!: string;
    description!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
