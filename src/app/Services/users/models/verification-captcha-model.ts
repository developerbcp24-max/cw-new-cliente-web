export class VerificationCaptchaModel {
    captchaValue = '';
    captchaValueToVerify = '';

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
