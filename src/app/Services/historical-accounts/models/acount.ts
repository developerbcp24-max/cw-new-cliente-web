export class Account {
  id!: number;
  formattedAccount!: string;
  currency!: string;
  balance?: string;
  name?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
