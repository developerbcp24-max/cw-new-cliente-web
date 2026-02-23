export class ChangedAmount {
  amount!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
