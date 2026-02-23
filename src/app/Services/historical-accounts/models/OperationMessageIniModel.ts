export class OperationMessageIniModel {
  types!: string;
  steeps!: number;
  message!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
