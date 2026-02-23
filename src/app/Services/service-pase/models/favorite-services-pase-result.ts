export class FavoriteServicesPaseResult {
    id!: number;
    name!: string;
    savedDate!: string;
    serviceCode!: string;
    parameters!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
