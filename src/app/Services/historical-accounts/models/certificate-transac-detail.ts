export class CertificateTransacDetail {

  operationStatusId!: number;
  amount!: number;
  currency!: string;
  gloss!: string;
  user!: string;
  movementDate!: string;
  movementHour!: string;
  accountsFormatted!: string;
  addressShipping!: string;
  reasonRejection!: string;
  dateModification!: Date;
  routeSarc!: string;
  numberLeter!: string;
  numberOperation!: number;
  certificateType!: string;
  formattedAccount!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
