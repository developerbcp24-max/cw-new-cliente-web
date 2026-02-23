import { DelapazDebt } from './delapaz-debt';
import { SendBill } from './send-bill';
import { Telephony } from './telephony';
import { CismartApprover } from '../../approvers-and-controllers/models/cismart-approver';

export class ServicePayment {
  operationTypeId!: number;
  operationTypeName!: string;
  sourceAccount!: string;
  sourceAccountId!: number;
  amount!: number;
  isScheduledProcess!: boolean;
  scheduledProcess!: Date;
  isFavorite!: boolean;
  favoriteName!: string;
  currency!: string;

  fundSource!: string;
  fundDestination!: string;
  sendVouchers!: string;
  approvers!: number[];
  controllers!: number[];
  cismartApprovers!: CismartApprover[];

  creSaguapacPayment!: CreSaguapacPayment[];
  delapazPayment!: DelapazDebt;
  telephonyPayment!: Telephony;
  billAddress!: SendBill;

  tokenName!: string;
  tokenCode!: string;
  isPrePreparer!: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class CreSaguapacPayment {
  serviceTypeId!: string;
  name!: string;
  documentNumber!: string;
  code!: string;
  period!: string;
  amount!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
