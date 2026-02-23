import { UserInvolved } from "../../shared/models/user-involved";
import { ServicesPaseDebtResult } from "./services-pase-debt-result";

export class ServicesPasePaymentDetail {
    processBatchId!: number;
    accountNumber!: string;
    amount!: number;
    currency!: string;
    serviceType!: string;
    detail: ServicesPaseDebtResult[] = [];
    userInvolveds: UserInvolved[] = [];

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
