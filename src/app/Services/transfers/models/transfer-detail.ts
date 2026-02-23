import { UserInvolved } from "../../shared/models/user-involved";

export class TransferDetail {
  sourceAccount!: string;
  destinationAccount!: string;
  beneficiary!: string;
  amount!: number;
  currency!: string;
  ticketNumber!: number;
  preferentialExchange!: number;
  isScheduledProcess!: boolean;
  scheduledProcessDate!: Date;
  user!: string;
  batchStatus!: string;
  bank!: string;
  branchOffice!: string;
  fundSource!: string;
  fundDestination!: string;
  userInvolveds!: UserInvolved[];
}
