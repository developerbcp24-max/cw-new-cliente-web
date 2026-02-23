export class ListQRPaymentDetailData {
  listQRPaymentDetail?: ListQRPaymentDetail[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class ListQRPaymentDetail {
  companyId!:        number;
  company!:          null;
  businessCode!:     string;
  abreviation!:      string;
  userName!:         string;
  userToken!:        string;
  atmCode!:          string;
  atmName!:          string;
  branchId!:         string;
  branchName!:       string;
  oldShareReport!:   boolean;
  userCreation!:     string;
  userModification!: string;
  dateCreation!:     Date;
  dateModification!: Date;
  isDeleted!:        boolean;
  id!:               number;
}

export class BusinessQR {
  isOk!:    boolean;
  message!: null;
  ListBusinesQR!:    ListBusinesQR[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class ListBusinesQR {
  id!:           number;
  companyId!:    number;
  businessCode!: string;
  abreviation!:  string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
