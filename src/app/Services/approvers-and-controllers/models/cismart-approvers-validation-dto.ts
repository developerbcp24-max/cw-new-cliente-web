import { Authorizer } from './authorizer';

export class CismartApproversValidationDto {
  accountId!: number;
  amount!: number;
  currency!: string;
  authorizers!: Authorizer[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
