export class BatchUIFResult {
    processBatchId!: number;
    isSFTP!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
