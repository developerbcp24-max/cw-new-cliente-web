export class SessionResult{
    username!: string;
    guid!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}