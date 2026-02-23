export class ClientResponseUser {
  name:               string= '';
  userName:           string= '';
  password:           string= '';
  roleUser:           string= '';
  email:              string= '';
  cellphone:          string= '';
  documentNumber:     string= '';
  documentType:       string= '';
  documentExtension:  string= '';
  documentComplement: string= '';
  status:             boolean=true;
  isDeleted: boolean=false;
  line?: number;
  userType: string ='';
  typeUser: string ='';
  roleCode: string= '';
  id: number =0;
  bachAtmId: number =0;
  qrUserId: number =0;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
