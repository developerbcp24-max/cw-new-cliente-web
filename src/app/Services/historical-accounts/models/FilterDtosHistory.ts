import { OperationTypeResult } from "../../track-transfers/models/operation-type-result";

export class FilterDtosHistory{
  descriptionSearch:string='';
  amountSearch: number=0.00;
  numberOperationSearch:number=0;
  channelSearch: string='';
  beneficiarySearch: string='';
  operationTypeSearch!:OperationTypeResult;
}
