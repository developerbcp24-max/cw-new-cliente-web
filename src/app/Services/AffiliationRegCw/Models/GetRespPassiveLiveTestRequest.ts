export class GetRespPassiveLiveTestRequest {
  idc: string = '';
  typeIdc: string = '';
  extensionIdc: string = '';
  complementIdc: string = '';
  email: string = '';
  phone: string = '';
  affCompanyId: string = '';
  flow: string = '1';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
