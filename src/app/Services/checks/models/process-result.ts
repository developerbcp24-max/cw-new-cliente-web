export class ProcessResult {
    message!: string;
    success!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
