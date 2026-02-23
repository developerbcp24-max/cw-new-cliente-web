import { UserRole } from "./GetSignaturesResponse";

export class GetAccountsResponse {
  currency: string = '';
  fullName: string = '';
  noAccount: string = '';
  typeAccount: string = '';
  noLong: string = '';
  isSelectAff: boolean = false;
  isMainAccount: boolean = false;
  userRols?: UserRole[] = [];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
