export class ValidateOTPDigitalFileRequest {
  idc: string = '';

  typeIdc: string = '';

  extensionIdc: string = '';

  complementIdc: string = '';

  affCompanyId: string = '';

  codeOTP: string = '';

  strIdClient: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
