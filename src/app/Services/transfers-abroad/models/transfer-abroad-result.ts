import { ProcessBatchDetailResult } from '../../shared/models/process-batch-detail-result';
import { UserInvolved } from '../../shared/models/user-involved';

export class TransferAbroadResult extends ProcessBatchDetailResult {
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
    detailCharges!: string;
    sourceAccountFormat!: string;
    operationStatus!: string;
    fundSource!: string;
    fundDestination!: string;
    isShowFunds!: boolean;
    processBatchId!: any;
    userInvolveds!: UserInvolved[];
}
