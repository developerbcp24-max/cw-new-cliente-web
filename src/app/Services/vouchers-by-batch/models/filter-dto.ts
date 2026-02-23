export class FilterDto {
    id!: number;
    operationTypeId!: number;
    batchId!: string;
    accountNumber!: string;
    dateInit!: Date;
    dateEnd!: Date;
    rowIni!: number;
    numberRow!: number;
    isFilter!: boolean;
    ebsNumber!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
