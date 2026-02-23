import { ProcessBatchDto } from '../../../shared/models/process-batch';
import { FavoritePaymentsDetailsForms } from './favorite-payments-details-forms';

export class FavoritePaymentsData extends ProcessBatchDto {
    processBatchId!: number;
    accountCurrency!: string;
    typeOperation!: string;
    dateProcess!: Date;
    ip?: string;
    spreadsheet: FavoritePaymentsDetailsForms =  new FavoritePaymentsDetailsForms();
}
