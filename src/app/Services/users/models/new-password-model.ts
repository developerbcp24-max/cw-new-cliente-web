import { VerificationCaptchaModel } from './verification-captcha-model';
import { IVerificationPinModel } from './verification-pin-model';

export class NewUserPassword extends VerificationCaptchaModel implements IVerificationPinModel {
  card!: string;
  pin!: string;
  accessNumber!: string;
  newPassword = '';
  confirmPassword = '';
  ipClient = '';
  userAlias: string ='';
  notExistAlias: boolean=false;
}
