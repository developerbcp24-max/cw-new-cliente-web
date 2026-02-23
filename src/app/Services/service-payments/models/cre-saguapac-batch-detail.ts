export class CreSaguapacBatchDetail {
  processBatchId!: number;
  accountNumber!: string;
  amount!: number;
  currency!: string;
  billAddress!: BillAddress;
  detail!: Detail;
}

export class BillAddress {
  streetType!: string;
  streetName!: string;
  doorNumber!: string;
  floor!: number;
  block!: number;
  lot!: string;
  urbanization!: string;
  neighborhood!: string;
  city!: string;
  province!: string;
  location!: string;
}

export class Detail {
  documentNumber!: string;
  period!: string;
  amount!: number;
  name!: string;
  code!: string;
  transactionNumber!: string;
  status!: string;
  rejectionCause!: string;
}
