export class MovAccountsDtoReport {
  NumberCta!: string;
  DateIni!: string;
  DateEnd!: string;
  RowIni!: number;
  NumberRow!: number;
  ReportType!: string;
  OutListType!: boolean;
  FormattedAccount!: string;
  Description!: string;
  Amount!: number;
  HostOperationNumber!: number;
  Channel!: string;
  Beneficiary!: string;
  OperationType!: number;
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
  ProviderId!: boolean;
  EBSTransactionNumber!: boolean;
  ChannelReport!: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
