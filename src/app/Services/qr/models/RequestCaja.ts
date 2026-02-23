export class RequestCaja{
  atmName:      string='';
  businessCode: number=0;
  branchCode:   number=0;
  qrUserId:       number=0;
  cellphone:    string='';
  account:      string='';
  line: number=0;
  branchQRPaymentId: number=0;
  userClientId: number =0;
  userClieName: string ='';
  userType: string='';
  branchName: string = '';
  atmCity: string='';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
