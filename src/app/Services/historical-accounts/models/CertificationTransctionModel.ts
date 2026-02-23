export class CertificationTransction {
  processBatchId!: number;
  operationStatusId!: string;
  amount!: number;
  currency!: string;
  numberOperation!: number;
  gloss!: string;
  user!: string;
  movementDate!: string;
  movementHour!: string;
  accountsFormatted!: string;
  typeCertificate!: string;
  addressShipping!: string;
  reasonRejection!: string;
  dateModification!: Date;
  routeSarc!: string;
  certificateType!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
