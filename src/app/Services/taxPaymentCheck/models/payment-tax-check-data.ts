import { PaymentTaxCheckSpreadsheetsResult } from './payment-tax-check-spreadsheets-result';
import { ProcessBatchDto } from '../../shared/models/process-batch';

export class PaymentTaxCheckData extends ProcessBatchDto {
    sourceAccountNumber!: string;
    processBatchId!: number;
    statusOperation!: string;
    typeOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    spreadsheet: PaymentTaxCheckSpreadsheetsResult[] = [];
}
