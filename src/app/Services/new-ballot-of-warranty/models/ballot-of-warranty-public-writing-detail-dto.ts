export class BallotOfWarrantyPublicWritingDetailDto {
  publicWritingNumber!: string;
  datePublicWriting!: Date;
  nameOfNotaryPublicFaith!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
