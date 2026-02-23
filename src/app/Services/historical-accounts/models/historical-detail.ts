import { CertificateTransacDetail } from "./certificate-transac-detail";
import { ProcessBatchDto } from "../../shared/models/process-batch";

export class HistoricalDetail extends ProcessBatchDto {

    processBatchId!: number;
    state!: string;
    addressShipping!: string;
    certificateTransacDetails: CertificateTransacDetail[] = [];
}
