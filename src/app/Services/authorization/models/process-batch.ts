export class ProcessBatch {
  batchIds!: number[];
  operation!: number;
  rejectionCause?: string;
  password?: string;
  tokenName?: string;
  tokenCode?: string;
  isPlataformCW: boolean=true;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
