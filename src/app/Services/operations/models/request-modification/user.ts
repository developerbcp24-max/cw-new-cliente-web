export class User {
  id!: number;
  fullName!: string;
  documentNumber!: string;
  idcType!: string;
  idcComplement!: string;
  idcExtension!: string;
  email!: string;
  limit!: number;
  newEmail!: string;
  newLimit!: any;
  action!: number;
  status!: number;
  statusDescription!: string;
  roles!: Roles[];
}

export class Roles {
  operationTypeId!: number;
  formattedNumber!: string;
  roleId!: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
