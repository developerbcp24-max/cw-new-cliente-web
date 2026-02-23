import { VerificationCaptchaModel } from './verification-captcha-model';
import { IVerificationPinModel } from './verification-pin-model';

export class ValidatePinModel extends VerificationCaptchaModel implements IVerificationPinModel {
    card!: string;
    pin!: string;
}
