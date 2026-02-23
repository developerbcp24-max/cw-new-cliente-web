export class User {
    Email!: string;
    Username!: string;
    Password!: string;
    ConfirmPassword!: string;
    Nombre!: string;
    ApellidoMaterno!: string;
    ApellidoPaterno!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
