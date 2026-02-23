import { PaymentOddAchSpreadsheetResult } from './payment-odd-ach-spreadsheet-result';
import { ProcessBatchDto } from '../../../shared/models/process-batch';

export class PaymentOddAchData extends ProcessBatchDto {
    processBatchId!: number;
    statusOperation!: string;
    typeOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    spreadsheet: PaymentOddAchSpreadsheetResult[] = [];
}
