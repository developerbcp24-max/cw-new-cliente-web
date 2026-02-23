
export class GetDebtsDto {
    parameters = '';
    companyCode!: string;
    serviceCode!: string;
    serviceCodeDescription!: string;
    isAutoComplete!: boolean;
    isGenericPase!: boolean;
    billingType?: string;
}
