export class MonthsQuantityDto {
  quantity!: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
