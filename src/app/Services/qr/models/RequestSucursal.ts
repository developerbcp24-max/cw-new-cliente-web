export class RequestSucursal {
  businessCode: number=0;
  branchName:   string='';
  city:         string='';
  qrUserId:       number=0;
  businessId: number =0;
  id: number=0;
  line?: number;
  name?: string='';
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
