export class ResponseBranchOffices {
  id: number = -1;
  description: string = '';
  sigla: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
