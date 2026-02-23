import { ProvidersDepositInOtherBankCheckSpreadsheetsResult } from './providers-deposit-in-other-bank-check-spreadsheets-result';
import { ProcessBatchDto } from '../../shared/models/process-batch';

export class ProvidersDepositInOtherBankCheckData extends ProcessBatchDto {
    sourceAccountNumber!: string;
    processBatchId!: number;
    statusOperation!: string;
    typeOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    spreadsheet: ProvidersDepositInOtherBankCheckSpreadsheetsResult[] = [];

}
