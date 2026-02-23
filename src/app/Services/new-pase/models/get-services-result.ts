export class GetServicesResult {
    serviceCode!: string;
    descriptionCode!: string;
    parameters: Parameters [] = [];
    billingType?: string;
}

export class Parameters {
    name!: string;
    description!: string;
    numberOfParameters!: string;
    parameterType?: string;
    values?: string;
    arraySelect?: Array<any> = [];
}