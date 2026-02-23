export class AccountAchResult {
  titularAccount!: string;
  banckAlias!: string;
  isValid!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
