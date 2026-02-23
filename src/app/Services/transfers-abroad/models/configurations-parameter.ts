export class ConfigurationsParameter {
    maxAmountTransfer!: number;
    minAmountTransfer!: number;
    schedules!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
