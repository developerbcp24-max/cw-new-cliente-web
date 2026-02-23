export class GetDatesResult {
    isValidCellPhone!: boolean;
    isValidEmail!: boolean;
    cellPhone!: string;
    email!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
