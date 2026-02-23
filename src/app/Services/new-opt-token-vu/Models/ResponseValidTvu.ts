export class ResponseValidTvu {
  isAffiliated: boolean = false;
  message: string = '';
  tokenName: string = '';
  cic: string = '';
  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
