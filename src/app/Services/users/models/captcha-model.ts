export class CaptchaModel {
    image = '';
    value!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
