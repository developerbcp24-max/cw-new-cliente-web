export class UifcwResult {
    trace!: string;
    isValid!: boolean;
    isValidEFE!: boolean;
    isBlocked!: boolean;
    numberQueryUIF!: number;
    cumulus!: number;
    cumulusEFE!: number;
    numberChannelUIF!: string;
    operationTypeId!: number;
    causalTransaction!: string;
    typeTransaction!: string;
    branchOffice!: string;
    errorMessage!: string;
    isMultiple!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
