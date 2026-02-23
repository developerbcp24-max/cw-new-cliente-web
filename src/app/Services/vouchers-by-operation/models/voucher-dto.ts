export class VoucherDto {
  accountNumber!: string;
  InitialDate!: Date;
  EndDate!: Date;
  OperationId!: string;
  BatchId!: number;
  Provider!: string;
  rowIni!: number;
  numberRow!: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
