import { AccountPartialModel } from './AccountPartialModel';
export interface IAccountHistoricalModel {
  isOk: boolean;
  message: string;
  body: AccountPartialModel;
}
