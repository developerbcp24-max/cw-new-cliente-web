import { Role } from "./user-role";

export class ChangesInformation {
  user!: string;
  operationType!: string;
  operationTypeId!: number;
  userId!: number;
  roles!: Role[];
  account!: string;
  accountId!: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
