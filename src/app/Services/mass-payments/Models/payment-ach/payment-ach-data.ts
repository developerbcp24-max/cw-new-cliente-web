import { PaymentAchSpreadsheetResult } from './payment-ach-spreadsheet-result';
import { ProcessBatchDto } from '../../../shared/models/process-batch';
import { TransferTypes } from '../../../shared/enums/transfer-types';

export class PaymentAchData extends ProcessBatchDto {
  processBatchId!: number;
  statusOperation!: string;
  typeOperation!: string;
  dateProcess!: Date;
  isFavorite!: boolean;
  favoriteName!: string;
  override operationStatusId: number =0;
  ip: string='';
  type!: TransferTypes;
  spreadsheet: PaymentAchSpreadsheetResult[] = [];
}
