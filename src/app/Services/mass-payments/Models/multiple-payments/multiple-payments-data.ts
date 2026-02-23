import { MultiplePaymentsDetailsForms } from './multiple-payments-details-forms';
import { ProcessBatchDto } from '../../../shared/models/process-batch';

export class MultiplePaymentsData extends ProcessBatchDto {
    processBatchId!: number;
    typeOperation!: string;
    accountCurrency!: string;
    statusOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    ip?: string;
    override operationStatusId: number = 0;
    spreadsheet: MultiplePaymentsDetailsForms =  new MultiplePaymentsDetailsForms();
}
