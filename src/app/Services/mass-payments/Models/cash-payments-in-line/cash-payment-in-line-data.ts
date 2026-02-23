import { ProcessBatchDto } from "../../../shared/models/process-batch";
import { CashPaymentsInLineSpreadsheetsResult } from "./cash-payments-in-line-spreadsheets-result";

export class CashPaymentInLineData extends ProcessBatchDto {
    processBatchId!: number;
    statusOperation!: string;
    typeOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    spreadsheet: CashPaymentsInLineSpreadsheetsResult[] = [];
  }