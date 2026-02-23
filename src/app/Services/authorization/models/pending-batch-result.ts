import { BatchDetail } from './batch-detail';

export class PendingBatchResult {
  batchesToControl!: BatchDetail[];
  batchesToAuthorize!: BatchDetail[];
  batchesToPreSave!: BatchDetail[];

  totalItemsAuthorize!: number;
  totalItemsControl!: number;
  totalItemsPreSave!: number;
}
