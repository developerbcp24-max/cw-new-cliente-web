export class MovementDepositAbonoResponseModel {
  id?: number;
  date?: string;
  hour?: string;
  hostOperationNumber?: string;
  description?: string;
  channel?: string;
  gloss?: string;
  location?: string;
  amount?: number;
  agencyBranch?: string;
  teti?: string;
  valuta?: string;
  user?: string;
  utc?: string;
  transactionType?: string;
  destinationAccount?: string;
  beneficiary?: string;
  destinationBank?: string;
  destinationGloss?: string;
  companyNameTrade?: string;
  companyService?: string;
  depositorCode?: string;
  emisorAccount?: string;
  emisor?: string;
  sourceBank?: string;
  destCurrency?:string;

  constructor(values: Partial<MovementDepositAbonoResponseModel> = {}) {
      Object.assign(this, values);
  }
}