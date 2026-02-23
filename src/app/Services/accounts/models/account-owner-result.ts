export class AccountOwnerResult {
  currency!: string;
  owner!: string;
  isOwnerHasError = false;
  formattedNumber!: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
