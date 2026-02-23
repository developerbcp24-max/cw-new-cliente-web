import { Authorizer } from './authorizer';

export class CismartAuthorizerResult {
  instructions!: string;
  authorizers: Authorizer[] = [];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
