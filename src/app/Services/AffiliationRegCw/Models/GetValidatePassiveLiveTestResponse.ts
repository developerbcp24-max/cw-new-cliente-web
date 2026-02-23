export class GetValidatePassiveLiveTestResponse {
    idc: string = '';
    state: boolean = true;
    finishedProcess: boolean = true
    phase: string = '';
    idDigitalSignature: number = -1;
    sessionID: string = '';
    dateTime: string = '';


  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
