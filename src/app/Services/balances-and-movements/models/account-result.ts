export class AccountResult {
  id!: number;
  number!: string;
  type!: string;
  application!: string;
  applicationDescription!: string;
  currency!: string;
  currencyDescription!: string;
  formattedNumber!: string;
  owner!: string;
  inProgressOperations!: number;
  withholding!: number;
  averageBalance!: number;
  availableBalance!: number;
  accountingBalance!: number;
  position!: number;
  overdraftAmount?: number;
  overdraftBalance?: number;
  isAuthorizerControl!: boolean;
  balanceErrorMessage?: string;
  documentAccount!: string;

  isSelected!: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
