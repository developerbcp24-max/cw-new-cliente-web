import { VerificationCaptchaModel } from './verification-captcha-model';

export class Login extends VerificationCaptchaModel {
    username!: string;
    password = '';
    codeOTP = '';
    userAlias:string='';
    isAlias: boolean=false;
}
