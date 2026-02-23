import { SalariesPaymentsSpreadsheetsResult } from './salaries-payments-spreadsheets-result';
import { ProcessBatchDto } from '../../../shared/models/process-batch';

export class SalariesPaymentData extends ProcessBatchDto {
  processBatchId!: number;
  isFavorite!: boolean;
  favoriteName!: string;
  statusOperation!: string;
  dateProcess!: Date;
  spreadsheet: SalariesPaymentsSpreadsheetsResult[] = [];
}
