import { MovAccountsModel } from './MovAccountsModel';

export class HistoricalAccountsResult {
  tableInitial!: MovAccountsModel[];
  tableBody!: MovAccountsModel[];
  tableEnd!: MovAccountsModel[];
  flagHistTr!: boolean;
  isSofia!: boolean;
}
