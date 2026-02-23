import { ProcessBatchDto } from '../../shared/models/process-batch';
import { CertificationTransction } from './CertificationTransctionModel';

export class SaveHistoricalAccountDto extends ProcessBatchDto {

  operationType!: string;
  CertificateTransactions: CertificationTransction[]= [];

}
