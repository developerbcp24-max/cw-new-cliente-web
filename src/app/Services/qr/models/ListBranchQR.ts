export class BranchQR {
  isOk!: boolean;
  message!: null;
  ListBranchQR: ListBranchQR[] = [];
}

export class ListBranchQR {
  businessQRPaymentId!: number;
  branchCode!: string;
  branchName!: string;
  user!: null;
  userToken!: null;
  userName!: null;
  password!: null;

  businessCode: number = 0;
  city: string = '';
  qrUserId: number = 0;
  businessId: number = 0;
  id: number = 0;
  line?: number;
  name?: string = '';
  isDeleted: boolean=false;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class RequestBranchQR {
  Id: number = 0;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class CurrencyBO {
  value: string = '';
  description: string = '';
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class BranchBO {
  value: string = '';
  description: string = '';
  services: ServiceBO []= [];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
export class ServiceBO {
  value: string = '';
  description: string = '';
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
