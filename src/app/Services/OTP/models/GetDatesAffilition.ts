export class GetDatesAffilition {
  Idc!: string;
  Cic!: string;
  Email!: string;
  ValidationType!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
