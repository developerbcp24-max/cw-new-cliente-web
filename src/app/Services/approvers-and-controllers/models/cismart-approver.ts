export class CismartApprover {
  idc!: string;
  id!: number;
  type!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
