export class BatchIdDto {
  processBatchId!: number;
  service!: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
