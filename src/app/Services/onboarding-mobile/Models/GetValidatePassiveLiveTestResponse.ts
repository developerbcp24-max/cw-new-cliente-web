export class GetValidatePassiveLiveTestResponse {
  idc: string = '';
  state: boolean = false;
  finishedProcess: boolean = false;
  phase: string = '';
  idDigitalSignature: number = -1;
  sessionID: string = '';
  dateTime: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
