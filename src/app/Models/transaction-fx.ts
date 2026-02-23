export class TransactionFx {
  acountBs!: string;
  acountSus!: string;
  bankerName!: string | null;
  startDate!: string;
  endDate!: string;
  amount!: number;
  currency!: string;
  ticketNumber!: number;
  preferentialExchange!: number;
  isScheduledProcess!: boolean;
  scheduledProcessDate!: string;
  user!: string;
  batchStatus!: string;
  fundSource!: string;
  fundDestination!: string;
  bank!: string | null;
  branchOffice!: string | null;
  userInvolveds!: UserInvolved[];
  detail!: string;
}

class UserInvolved {
  userDescription!: string;
  userName!: string;
  dateAction!: string;
  reasonRejection!: string | null;
}
