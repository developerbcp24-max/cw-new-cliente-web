export class GetAccountsRequest {
  numeroCuenta: string = '';
  cic: string = '';
  idcNit:string = '';
  affCompanyId: string = '';
  isRepresentative: boolean = true;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
