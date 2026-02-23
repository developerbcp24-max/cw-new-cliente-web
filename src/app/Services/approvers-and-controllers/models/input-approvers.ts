export class InputApprovers {
  accountId?: number;
  accountNumber?: string;
  isAuthorizerControl?: boolean;
  batchId?: number;
  operationTypeId!: number;
  isSignerScheme?: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
