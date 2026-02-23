export class BallotOfWarrantyAmortizationDto {
  toThe!: Date;
  amount!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
