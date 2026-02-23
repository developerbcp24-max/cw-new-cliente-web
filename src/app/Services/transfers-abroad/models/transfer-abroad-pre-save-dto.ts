import { ProcessBatchDto } from '../../shared/models/process-batch';
import { Constants } from '../../shared/enums/constants';

export class TransferAbroadPreSaveDto extends ProcessBatchDto {
    destinationAmount!: number;
    destinationCurrency: string;
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
    override tokenCode: string ='';
    override tokenName: string='';
    detailCharges!: string;

    constructor() {
        super();
        this.currency = Constants.currencyUsd;
        this.destinationCurrency = Constants.currencyUsd;
    }
}
