export class DateFutureModel {
    isDateFuture!: boolean;
    date!: Date;
    dateString!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
