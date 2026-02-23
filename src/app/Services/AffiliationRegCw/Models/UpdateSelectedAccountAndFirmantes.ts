import { GetAccountsResponse } from './GetAccountsResponse';
import { GetSignaturesResponse } from './GetSignaturesResponse';

export class UpdateSelectedAccountAndFirmantes {
  affCompanyId: string = '';
  necessaryAccounts: GetAccountsResponse[] = [];
  necessaryfirmantes: GetSignaturesResponse[] = [];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
