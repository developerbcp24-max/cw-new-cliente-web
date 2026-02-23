export class EmailInputModel {
    isEmailInputSelected!: boolean;
    emails!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
