import { AccountUse } from "../../../shared/enums/account-use";

export class UserRole {
  operationTypeId!: number;
  userId!: number;
  account: Account[] = [];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class Account {
  id!: number;
  formattedNumber!: string;
  accountUse: string = String.fromCharCode(AccountUse.debit);
  role!: Role[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class Role {
  id!: number;
  isSelected!: boolean;
  isEditable!: boolean;
  status!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
