import { EmployResult } from './employ-result';
import { ParameterResult } from '../../parameters/models/parameter-result';
import { PublicWritingDetailResult } from './public-writing-detail-result';

export class ParametersResult {

  listCivilState: ParameterResult[] = [];
  listWarrantyTypes: ParameterResult[] = [];
  otherWarranties: ParameterResult[] = [];
  listFFNN: EmployResult[] = [];
  listPublicWriting: PublicWritingDetailResult[] = [];
  amountRequiredRoe!: number;
  ballotOfWarranty!: number;
  ballotOfWarrantyCOM!: number;
  ballotOfWarrantyDPF!: number;
  ballotOfWarrantyLCR!: number;
  ballotOfWarrantyPDF!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
