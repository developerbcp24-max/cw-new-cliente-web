import { CismartApprover } from '../../approvers-and-controllers/models/cismart-approver';
import { ProcessBatchDto } from '../../shared/models/process-batch';

export class AFPPayment extends ProcessBatchDto {

  override amount: number=0;
  override approvers: number[]=[];
  override controllers: number[]=[];
  override cismartApprovers: CismartApprover[]=[];
  override currency: string='';
  override operationTypeId: number=0;
  override sourceAccount: string='';
  override sourceAccountId: number=0;
  override tokenName: string='';
  override tokenCode: string='';
  override sendVouchers: string='';
  override sourceCurrency: string='';

  serviceInformation!: PaymentAFP;
}
export class PaymentAFP {
  nameAFP!: string;
  periodAFP!: string;
  spreadsheetsAFP!: string;
  documentNumber!: string;
  documentType!: string;
  deatilAFPsDto!: DetailAFPDto[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class DetailAFPDto {
  expirationDate!: string;
  amounts!: number;
  typeContribution!: string;
  accountNumberAFP!: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
