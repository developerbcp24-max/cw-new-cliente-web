export class ResponseTermsAndConditions {
  id: number = -1;
  contractType: string = '';
  containContract: string = '';
  parametersNumber: number = -1;
  description: string = '';
  title: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
