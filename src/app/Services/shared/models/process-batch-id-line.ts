export class ProcessBatchIdLine {
    processBatchId!: number;
    line!: number;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}