import { AccountResult } from '../../accounts/models/account-result';
export class TargetDataTransferModel {
    account!: AccountResult;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
