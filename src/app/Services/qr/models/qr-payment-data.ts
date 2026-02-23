import { QrPaymaentsResult } from './qr-payments-result';
import { ProcessBatchDto } from '../../shared/models/process-batch';
export class QrPaymentData extends ProcessBatchDto {
  batchIds?: number[];
  ProcessBatchId?: number;
  isFavorite?: boolean;
  favoriteName?: string;
  statusOperation?: string;
  dateProcess?: Date;
  spreadsheet: QrPaymaentsResult[] = [];
}
