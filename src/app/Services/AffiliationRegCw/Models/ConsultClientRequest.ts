export class ConsultClientRequest {
  idc: string = '';
  extensionIdc: string = '';
  complement: string = '';
  typeIdc: string = 'Q';
  nroCuenta: string = '';
  nit: string = '';
  typeNit: string = '';
  isRepresentative: boolean = false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
