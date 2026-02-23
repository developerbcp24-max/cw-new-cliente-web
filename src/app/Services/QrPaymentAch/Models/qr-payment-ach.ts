import { UserInvolved } from '../../shared/models/user-involved';

export class QrPaymentAchDetail {
  sourceAccount: string;
  destinationAccount: string;
  beneficiary: string;
  bank: string;
  amount: number;
  currency: string;
  user: string;
  gloss: string;
  batchStatus: string;
  processMessage: string;
  sourceFunds: string;
  destinationFunds: string;
  userInvolved: UserInvolved[];

  constructor() {
    this.sourceAccount = '';
    this.destinationAccount = '';
    this.beneficiary = '';
    this.bank = '';
    this.amount = 0;
    this.currency = '';
    this.user = '';
    this.gloss = '';
    this.batchStatus = '';
    this.processMessage = '';
    this.sourceFunds = '';
    this.destinationFunds = '';
    this.userInvolved = [];
  }
}
