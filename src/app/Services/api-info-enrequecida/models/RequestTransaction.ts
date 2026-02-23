export class RequestTransaction {
  id!: number;
  date!: string;
  hour!: string;
  hostOperationNumber!: string;
  description!: string;
  channel!: string;
  gloss!: string;
  location!: string;
  amount!: number;
  agencyBranch!: string;
  teti!: string;
  valuta!: string;
  user!: string;
  utc!: string;
  emisorAccount!: string;
  emisor!: string;
  sourceBank!: string;
  accountNumber!: string;
  accountType!: string;
  TransactionType!:     string;
  destinationAccount!:  string;
  beneficiary!:         string;
  destinationBank!:     string;
  destinationGloss!:    string;
  companyNameTrade!:    string;
  companyService!:      string;
  depositorCode!:       string;
  constructor(values: Partial<RequestTransaction> = {}) {
      Object.assign(this, values);
  }
}