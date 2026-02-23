import { Operation } from './operation';

export class MassPaymentFavoriteTransactions {
  id!: number;
  name!: string;
  description!: string;
  amount!: number;
  currency!: string;
  operationDebit!: string;
  operation!: Operation;
  bankAlias!: string;
}
