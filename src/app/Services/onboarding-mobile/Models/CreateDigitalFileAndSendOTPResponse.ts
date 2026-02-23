export class CreateDigitalFileAndSendOTPResponse {
  strIdClien: string = '';

  respFileBackUP: string = '';

  respOtp: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
