import { ProcessBatchDto } from '../../shared/models/process-batch';

export class ClaimRequestDto extends ProcessBatchDto {
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
    state!: string;
    numberCaseSarc!: string;
    branchOffice!: string;
    agency!: string;
    serviceId!: string;
    amountClaim!: number;
    currencyClaim!: string;
    respondeType!: number;
}
