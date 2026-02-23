export class ServicesDto {
    companyCode!: number;
    rubroCode!: number;

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
