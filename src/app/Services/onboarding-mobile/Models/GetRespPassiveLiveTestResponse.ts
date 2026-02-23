export class GetRespPassiveLiveTestResponse {
  url: string = '';
  sessionID: string = '';
  dateTime: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
