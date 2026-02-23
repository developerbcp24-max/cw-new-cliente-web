export class BatchDetail {
  id!: number;
  beneficiary!: string;
  operationType!: string;
  operationTypeId!: number;
  account!: string;
  amount!: number;
  currency!: string;
  creationDate!: Date;
  isOperationScheduled!: boolean;
  operationScheduledDate!: Date;
  accountId!: number;
  isAuthorizerControl!: boolean;
  isSelected!: boolean;
  ebsTransactionNumber!: string;
  isVisibleEBSNumber!: boolean;
  causalTransaction?: string;
  description?: string;
  sourceFunds?: string;
  destinationFunds?: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
