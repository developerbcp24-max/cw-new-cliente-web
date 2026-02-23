export class ClientDebtsEntelResult {
    item!: string;
    description!: string;
    amount!: string;
    agrupator!: string;
    numberBill!: string;
    dosificationBatch!: string;
    nit!: string;
    rentNumber!: string;
    period!: string;
    beneficiaryReason!: string;
    typeBill!: string;
    minAmount!: number;
    minAmountOriginal!: number;
    actualBalance!: number;
    isSelected!: boolean;
    isValidPeriod: boolean = true;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}