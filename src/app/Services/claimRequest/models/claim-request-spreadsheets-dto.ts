export class ClaimRequestSpreadsheetsDto {
    id!: number;
    typeOfLoad?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
