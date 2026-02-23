export class MonthsResult {

  id!: number;
  firstDay!: string;
  lastDay!: string;
  codeDate!: string;
  descriptionDate!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
