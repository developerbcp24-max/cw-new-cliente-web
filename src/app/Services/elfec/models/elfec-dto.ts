import { ElfecPaymentDto } from "./elfec-payment-dto";
import { ProcessBatchDto } from "../../shared/models/process-batch";

export class ElfecDto extends ProcessBatchDto {
    nus!: string;
    accountNumber!: string;
    isFavorite!: boolean;
    favoriteName!: string;
    elfecPayments: ElfecPaymentDto[] = [];
}
