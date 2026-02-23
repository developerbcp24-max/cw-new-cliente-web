export class BatchStatus {
  id!: number;
  operation!: string;
  sourceAccount!: string;
  amount!: number;
  currency!: string;
  status!: string;
  result!: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
