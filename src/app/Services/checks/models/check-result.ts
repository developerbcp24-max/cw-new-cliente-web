import { ProcessResult } from './process-result';

export class CheckResult {
    idCheck!: string;
    idLote!: string;
    mICR!: string;
    checkImg!: string;
    checkName!: string;
    iDCKind!: string;
    iDCExt!: string;
    iDC!: string;
    accountNro!: string;
    exchange!: string;
    amount!: number;
    receiveCity!: number;
    receiveOffice!: number;
    receiveUser!: string;
    registerUser!: string;
    regDate!: Date;
    cityName!: string;
    officeName!: string;
    modUser!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class CheckListResult extends ProcessResult {
    checkList!: CheckResult[];
}
