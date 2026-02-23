export class CismartAuthorizerDto {
  accountNumber!: string;
  accountId!: number;
  operationTypeId!: number;
  batchId?: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
