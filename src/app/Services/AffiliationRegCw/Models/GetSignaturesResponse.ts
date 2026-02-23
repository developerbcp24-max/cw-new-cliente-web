export class GetSignaturesResponse {
  nroAccount: string = '';
  personId: string = '';
  idcType: string = '';
  extension: string = '';
  complement: string = '';
  names: string = '';
  lastNames: string = '';
  type: string = '';
  email: string = '';
  phone: string = '';
  isSelectAff: boolean = false;
  isMainSignature: boolean = false;
  isNewUserAff: boolean = false;
  userRols?: UserRole[] = [];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class UserRole {
  isAuthorizer: boolean = false;
  isController: boolean = false;
  isPreparer: boolean = false;
  isConsultant: boolean = false;
  noAccount: string = '';

}
