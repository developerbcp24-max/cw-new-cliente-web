import { ProcessBatchDto } from "../../shared/models/process-batch";
import { Payment } from "./payment";

export class RuatPayment extends ProcessBatchDto {
  service!: string;
  payment: Payment = new Payment();
}
