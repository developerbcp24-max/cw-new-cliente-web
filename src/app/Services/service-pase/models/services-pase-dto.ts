import { ProcessBatchDto } from "../../shared/models/process-batch";
import { ServicesPasePaymentDto } from "./services-pase-payment-dto";

export class ServicesPaseDto extends ProcessBatchDto {
    parameters!: string;
    isFavorite!: boolean;
    favoriteName!: string;
    servicesPasePayments: ServicesPasePaymentDto[] = [];
  }
