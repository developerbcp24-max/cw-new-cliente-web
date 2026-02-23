export class VoucherResult {
  id!: number;
  tableId!: number;
  line!: number;
  operationNumberDebitHost!: string;
  operationTypeId!: number;
  nameOperation!: string;
  formattedAccount!: string;
  currency!: string;
  amount!: number;
  dateCreation!: Date;
  beneficiary!: string;
  destinationAccount!: string;
  payer!: string;
  isMultipleDebits!: boolean;
  purchase!: number;
  sale!: number;
  isSelected!: boolean;
  transferTypeId!: number;
  totalItems!: number;
  enabled!: number;
  isVisibleButton: boolean = false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
