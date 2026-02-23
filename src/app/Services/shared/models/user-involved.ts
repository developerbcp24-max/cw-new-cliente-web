export class UserInvolved {
    userDescription!: string;
    userName!: string;
    dateAction!: Date;
    reasonRejection!: string;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
