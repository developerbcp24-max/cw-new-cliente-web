export class CreateDigitalFileAndSendOTPResponse {
    strIdClien: string = '';
    respFileBackUP: boolean = true;
    respOtp: boolean = true;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
