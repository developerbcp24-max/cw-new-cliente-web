import { ProcessBatchDto } from '../../shared/models/process-batch';

export class QuotaPaymentDto extends ProcessBatchDto {
    accountId!: number;
    expirationDate!: Date;
    override tokenCode: string='';
    override tokenName: string='';
    sendVoucher!: string;
}
