import { ProcessBatchDto } from '../../shared/models/process-batch';
import { RSA } from '../../shared/models/rsa';

export class TransferAbroadDto extends ProcessBatchDto implements RSA {
    processBatchId!: number;
    destinationAmount!: number;
    destinationCurrency!: string;
    commissionTransfer!: number;
    commissionOur!: number;
    commissionCarta!: number;
    isTicketCommission!: boolean;
    numberTicketCommission!: string;
    commissionAmount!: number;
    amountTicketCommissionOur!: number;
    isTicketOtherCurrency!: boolean;
    numberTicketOtherCurrency!: string;
    typeTicketOtherCurrency!: string;
    amountTicketOtherCurrency!: number;
    exchangeRateOperationTicketOtherCurrency!: number;
    amountInDollarsTicketOtherCurrency!: number;
    cicTicketOtherCurrency!: string;
    transferOperationType!: number;
    companyCic!: string;
    ticketCommissionImporte!: number;
    ticketCommissionPorte!: number;
    tickectCommissionState!: string;
    comissionnZero!: string;
    comissionnZeroOur!: string;
    ticketCommissionOthers!: number;
    override tokenCode: string='';
    override tokenName: string='';
    detailCharges!: string;
    formattedAccount!: string;
    override sendVouchers: string='';
    override approvers: number[]=[];
    override controllers: number[]=[];
}
