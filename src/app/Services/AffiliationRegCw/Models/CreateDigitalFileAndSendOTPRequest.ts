export class CreateDigitalFileAndSendOTPRequest {
  idc: string = '';
  extensionIdc: string = '';
  typeIdc: string = '';
  complementIdc: string = '';
  email: string = '';
  phone: string = '';
  requestDate: string = '';
  affCompanyId: string = '';
  flow: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
