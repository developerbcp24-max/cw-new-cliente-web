export class GetBranchListResponse {
    data!:    Data;
    state!:   string;
    message!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class Data {
    branchs!: Branchs[];
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class Branchs {
  value: string = '';
  description: string = '';
  services: ServiceBO []= [];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
export class ServiceBO {
  value: string = '';
  description: string = '';
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
