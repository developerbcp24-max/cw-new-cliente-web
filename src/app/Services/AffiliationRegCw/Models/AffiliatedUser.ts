export class AffiliatedUser {
  name: string = '';
  email: string = '';
  documentNumber: string = '';
  complement: string = '';
  extension: string = '';
  accountNumber: string = '';
  phone: string = '';
  lastNames: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
