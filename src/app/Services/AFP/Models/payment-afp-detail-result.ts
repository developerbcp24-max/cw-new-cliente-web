
import { UserInvolved } from "../../shared/models/user-involved";

export class PaymentAfpDetailResult {
    processBatchId!: number;
    sourceAccount!: string;
    amount!: number;
    currency!: string;
    serviceType!: string;
    afp!: string;
    concept!: string;
    fundSource!: string;
    fundDestination!: string;
    userInvolveds!: UserInvolved[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
