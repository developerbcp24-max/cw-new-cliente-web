export class MovAccountsDto {
  NumberCta!: string;
  DateIni!: string;
  DateEnd!: string;
  RowIni!: number;
  NumberRow!: number;
  ReportType!: string;
  OutListType!: boolean;
  FormattedAccount!: string;

  Col01!: boolean;
  Col02!: boolean;
  Col03!: boolean;
  Col04!: boolean;
  Col05!: boolean;
  Col06!: boolean;
  Col07!: boolean;
  Col08!: boolean;
  Col09!: boolean;
  Col10!: boolean;

  NroLote!: boolean;
  Ordenante!: boolean;
  Benifi!: boolean;
  Document!: boolean;
  Operation!: boolean;
  Channel!: boolean;
  ProviderId!: boolean;
  EBSTransactionNumber!: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
