export class GetValidatePassiveLiveTestRequest {
  affCompanyId: string = '';
  sessionID: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
