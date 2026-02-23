import { ProcessBatchDto } from "../../../shared/models/process-batch";
import { SoliPaymentsSpreadsheetsResult } from "./soli-payments-spreadsheets-result";

export class SoliPaymentData extends ProcessBatchDto {
    processBatchId!: number;
    statusOperation!: string;
    typeOperation!: string;
    dateProcess!: Date;
    isFavorite!: boolean;
    favoriteName!: string;
    spreadsheet: SoliPaymentsSpreadsheetsResult[] = [];
  }