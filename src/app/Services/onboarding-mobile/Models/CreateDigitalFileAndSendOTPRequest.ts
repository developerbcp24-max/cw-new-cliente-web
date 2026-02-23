export class CreateDigitalFileAndSendOTPRequest {
  idc: string = '';

  typeIdc: string = '';

  extensionIdc: string = '';

  complementIdc: string = '';

  email: string = '';

  phone: string = '';

  requestDate: string = '';

  affCompanyId: number = -1;

  flow: string = '2';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
