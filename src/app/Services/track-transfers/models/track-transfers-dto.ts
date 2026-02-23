export class TrackTransfersDto {
  InitialDate?: Date;
  EndDate?: Date;
  OperationStatusId!: number;
  OperationTypeId!: number;
  OperationTypeName!: string;
  Beneficiary!: string;
  ReportType!: string;
  CompanyName!: string;
  CompanyId!: number;
  OrderByAsc!: boolean;
  batchId!: string;
  rowIni!: number;
  numberRow!: number;
  constructor(values: Object = {}) {
     Object.assign(this, values);
  }
}
