export class AccountClientResult {
  titularAccount!: string;
  isOk!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
