import { UserInvolved } from "../../shared/models/user-involved";
import { EntelDetailPaymentDto } from "./entel-dto";

export class EntelDetailResult {
    processBatchId!: number;
    accountNumber!: string;
    amount!: number;
    currency!: string;
    serviceType!: string;
    detail: EntelDetailPaymentDto[] = [];
    UserInvolveds: UserInvolved[] = [];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}