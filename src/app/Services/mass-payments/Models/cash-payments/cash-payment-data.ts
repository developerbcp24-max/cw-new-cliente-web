import { CashPaymentsSpreadsheetsResult } from './cash-payments-spreadsheets-result';
import { ProcessBatchDto } from '../../../shared/models/process-batch';

export class CashPaymentData extends ProcessBatchDto {
  processBatchId: number = 0;
  statusOperation!: string;
  typeOperation!: string;
  dateProcess!: Date;
  isFavorite!: boolean;
  favoriteName!: string;
  spreadsheet: CashPaymentsSpreadsheetsResult[] = [];
}
