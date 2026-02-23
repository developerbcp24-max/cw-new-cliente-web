export class UserCreationId {
    id!: number;
    userId!: number;
    userAuthorizedId!: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
