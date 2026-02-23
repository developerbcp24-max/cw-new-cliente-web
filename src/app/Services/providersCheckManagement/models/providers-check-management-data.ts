import { ProvidersCheckManagementSpreadsheetsResult} from './providers-check-management-spreadsheets-result';
import { ProcessBatchDto } from '../../shared/models/process-batch';

export class ProvidersCheckManagementData extends ProcessBatchDto {
    processBatchId!: number;
    statusOperation!: string;
    typeOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    spreadsheet: ProvidersCheckManagementSpreadsheetsResult[] = [];

}
