export class ReqUserBO {
  publicToken:  string = '';
  appUserId:    string = '';
  businessCode: string = '';
  roleCode:     string = '';
  channel:      string = '';
  typeUser:     string = '';
  client:       Client = new Client();
  device:       Device = new Device();
}

export class Client {
  name:               string= '';
  userName:           string= '';
  password:           string= '';
  email:              string= '';
  cellphone:          string= '';
  documentNumber:     string= '';
  documentType:       string= '';
  documentExtension:  string= '';
  documentComplement: string= '';
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class Device {
  id:   string='';
  type: string='';
  name: string='';
  os:   string='';
}
