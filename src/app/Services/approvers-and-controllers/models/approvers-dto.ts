export class ApproversDto {
  accountId?: number;
  isAuthorizerControl?: boolean;
  batchId?: number;
  operationTypeId!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
