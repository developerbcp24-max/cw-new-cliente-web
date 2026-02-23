export class GetDebtsResponse {
    client!: string;
    contract!: string;

    debts: ListDebts [] = [];
}

 export class ListDebts {
    voucherType!: string;
    voucherSeries!: string;
    voucherNumber!: string;
    billingPeriod!: string;
    emissionDate!: string;
    endDate!: string;
    amount!: number;
    balance!: number;
    voucherStatus!: string;
    isSelected!: boolean;
    isValidPeriod: boolean = true;
 }