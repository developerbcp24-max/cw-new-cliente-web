export class RequestApiInfoModel
{
    DatesInicial!: string;
    DatesEnd!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
