export class ParameterDto {
    group!: string;
    code!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
