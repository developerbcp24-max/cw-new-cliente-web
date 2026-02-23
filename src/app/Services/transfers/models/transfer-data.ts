import { ProcessBatchDto } from '../../shared/models/process-batch';
import { TransferTypes } from '../../shared/enums/transfer-types';

export class TransferData extends ProcessBatchDto {
  isFavorite!: boolean;
  favoriteName!: string;
  beneficiary!: string;
  destinationAccount!: string;
  targetAccountCurrency!: string;
  ip?: string;
  type!: TransferTypes;
  override tokenCode: string='';
  override tokenName: string='';
}
