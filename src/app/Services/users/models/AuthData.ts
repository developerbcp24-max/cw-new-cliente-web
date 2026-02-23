export class AuthData {
  access_token:  string='';
  token_type:    string='';
  expires_in:    number=0;
  refresh_token: string='';
  audience:      string='';
  issued:        string='';
  expires:       string='';
  sessionId:     string='';
  username: string='';
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
