export class BallotOfWarrantyContractRoeDto {
  contract!: string;
  roeDocument!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
