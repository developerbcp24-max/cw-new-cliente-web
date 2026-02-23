import { ProcessBatchDto } from "../../shared/models/process-batch";
import { UserInvolved } from "../../shared/models/user-involved";

export class ClaimRequestDetail extends ProcessBatchDto {

    processBatchId!: number;
    state!: string;
    department!: string;
    address!: string;
    phone!: string;
    workPhone!: string;
    cellPhone!: string;
    workCellPhone!: string;
    fax!: string;
    number!: number;
    email!: string;
    productName!: string;
    productId!: string;
    accountNumber!: string;
    cardNumber!: string;
    claimType!: string;
    serviceName!: string;
    transactionDate!: string;
    transactionTime!: string;
    descriptionClaim!: string;
    userId!: number;
    numberCaseSarc!: string;
    branchOffice!: string;
    agency!: string;
    serviceId!: string;
    amountClaim!: number;
    currencyClaim!: string;
    override userInvolveds: UserInvolved[] = [];
}
