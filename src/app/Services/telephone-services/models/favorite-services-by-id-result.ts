export class FavoriteServicesByIdResult {
    Parameters!: string;
    ServiceCode!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}