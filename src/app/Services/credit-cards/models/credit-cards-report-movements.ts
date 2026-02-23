export class ReportMovementsCreditCards {
    companyName!: string;
    numberAccount!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
