export class ReportQRRespons {
    data!:    Data;
    state!:   string;
    message!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class Data {
    transaccionDetails!: TransaccionDetail[];
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class TransaccionDetail {
  currency!:         string;
  businessName!:     string;
  amount!:           number;
  gloss!:            string;
  idc!:              string;
  receiverName!:     string;
  receiverDocument!: string;
  receiverBank!:     string;
  originAccount!:    string;
  destinyAccount!:   string;
  branchOffice!:     string;
  city!:             string;
  atm!:              string;
  businessCode!:     string;
  operationNumber!:  string;
  transaccionDate!:  Date;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
