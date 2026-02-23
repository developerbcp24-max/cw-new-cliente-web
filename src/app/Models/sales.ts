export class Sales {
  public id!: number;
  public dollarsById!: number;
  public processBatchId!: string;
  public companyId!: number;
  public name!: string;
  public sourceAccountSus!: string;
  public amount!: number;
  public exchange!: number;
  public balance!: number;
  public startDate!: Date;
  public endDate!: Date;
  public state!: number;
  public idOffer!: number;
  public commission: number = 1;
}
