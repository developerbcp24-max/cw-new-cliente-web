export class UifDto {
    amount!: number;
    isSuspiciusUif!: boolean;
    trace!: string;
    sourceFunds!: string;
    destinationFunds!: string;
    numberQueryUIF!: number;
    cumulus!: number;
    causalTransaction!: string;
    typeTransaction!: string;
    isMultiple = false;
    branchOffice!: string;
    processBatchId?: number;
    isAuthorized!: boolean;
}
