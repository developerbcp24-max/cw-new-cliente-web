export class FavoriteEntelResult {
    id!: string;
    name!: string;
    savedDate!: string;
    serviceCode!: string;
    parameters!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}