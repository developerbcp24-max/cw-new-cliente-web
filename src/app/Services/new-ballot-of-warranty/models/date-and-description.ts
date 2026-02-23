export class DateAndDescription {
    date!: Date;
    description!: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
