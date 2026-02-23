export class DelapazBatchDetail {
  processBatchId!: number;
  accountNumber!: string;
  amount!: number;
  currency!: string;
  processDate!: Date;
  transactionNumber!: string;
  detail!: Detail;
}

export class Detail {
  clientCode!: string;
  name!: string;
  address!: number;
  amount!: string;
  status!: string;
  rejectionCause!: string;
}
