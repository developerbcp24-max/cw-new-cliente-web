export class ATMQR {
  isOk!:    boolean;
  message!: null;
  ListAtmQR!:    ListAtmQR[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class ListAtmQR {
  branchQRPaymentId!: number;
  atmCode!:           string;
  atmName!:           string;
  name: string='';
  branchName: string='';
  city: string ='';
  id: number=0;
  isDeleted: boolean = false;
  userAtmQR!:         null;
  userToken!:         null;
  userName!:          null;
  password!:          null;
  oldShareReport!:    boolean;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
