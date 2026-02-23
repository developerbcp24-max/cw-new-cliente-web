export class MovAccountsBasicModel {
  NumberCta!: string;
  DateIni!: string;
  DateEnd!: string;
  RowIni!: number;
  NumberRow!: number;


  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
