import { CertificationTransction } from './CertificationTransctionModel';

export class HistoricalModelDto {

      isTicket!: boolean;
      isMultipleDebit!: boolean;
      operationtypeId!: number;
      operationStatusId!: number;
      dateProcess!: string;
      description!: string;
      currency!: string;
      amount!: number;
      amountTotal!: number;
      sourceAccount!: string;
      ticket!: number;
      operationNumberDebitHost!: string;
      preferentialExchange!: number;
      indicatorBuyOrSale!: string;
      fieldsCertificateTransactions: CertificationTransction[] = [];
}
