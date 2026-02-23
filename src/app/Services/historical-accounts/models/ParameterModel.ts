export class ParameterModel {
    id!: number;
    groups!: string;
    code!: string;
    value!: string;
    description!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}


