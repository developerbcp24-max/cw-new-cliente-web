import { UserInvolved } from "../../shared/models/user-involved";
import { ElfecDebtResult } from "./elfec-debt-result";

export class PaymentElfecDetailResult {

    processBatchId!: number;
    accountNumber!: string;
    amount!: number;
    currency!: string;
    serviceType!: string;
    detail: ElfecDebtResult[] = [];
    userInvolveds: UserInvolved[] = [];

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
