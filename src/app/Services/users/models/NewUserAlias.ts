import { VerificationCaptchaModel } from "./verification-captcha-model";
import { IVerificationPinModel } from "./verification-pin-model";

export class NewUserAlias  extends VerificationCaptchaModel implements IVerificationPinModel{
  card: string='';
  pin: string='';
  accessNumber: string ='';
  passwordAccess: string = '';
  userAlias: string ='';
  ipClient: string  = '';
 /*  constructor(values: Object = {}) {
    Object.assign(this, values);
} */
}

