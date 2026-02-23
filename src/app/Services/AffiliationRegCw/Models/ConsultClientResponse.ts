export class ConsultClientResponse {
  idc: string = '';
  name: string = '';
  typeIdc: string = '';
  extensionIdc: string = '';
  complement: string = '';
  nit: string = '';
  typeNit: string= '';
  cic: string = '';
  email: string = '';
  phone: string= '';
  affCompanyId: string = '';
  message: string= '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

