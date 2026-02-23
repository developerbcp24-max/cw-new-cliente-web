export class ProcessBatch {

  id!: number;
  operationTypeId!: number;
  accountId!: number;
  sourceAccount!: string;
  companyId!: number;
  amount!: number;
  currency!: string;
  dateProcess!: Date;
  exchangeBuy!: number;
  exchangeSale!: number;
  description!: string;
  isScheduledProcess!: boolean;
  scheduledProcess!: Date;
  isMultipleDebits!: boolean;
  operationNumberDebitHost!: string;
  isTicket!: boolean;
  numberTicket!: number;
  preferentialExchange!: number;
  indicatorBuyOrSale!: string;
  OperationStatusId!: number;
  processBatchId!: number;
  userCreation!: number;
  userModification?: number;
  dateCreation!: Date;
  dateModification?: Date;
  constructor(values: Object = {}) {
  Object.assign(this, values);
  }
}

