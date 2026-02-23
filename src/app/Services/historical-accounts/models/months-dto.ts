export class MonthsDto {
  numberMonths!: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
