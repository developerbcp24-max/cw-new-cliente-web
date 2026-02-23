export class GetFirmantesRequest {
  affCompanyId: string = '';
  nroCuenta: string = '';
  idc: string = '';
  typeIdc: string = '';
  extensionIdc: string = '';
  complementIdc: string = '';
  isRepresentative: boolean = true;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}