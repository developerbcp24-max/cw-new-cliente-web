export class RespRedirect {
  access_token:  string ='';
  token_type:    string='';
  expires_in:    number=0;
  refresh_token: string='';
  audience:      string='';
  issued:        string='';
  expires:       string='';
  username:      string='';
  slideChecked: boolean = false;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
