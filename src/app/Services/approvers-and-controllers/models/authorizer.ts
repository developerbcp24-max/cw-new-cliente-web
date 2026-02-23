export class Authorizer {
  names!: string;
  firstLastName!: string;
  secondLastName!: string;
  id!: number;
  status!: string;
  type!: string;
  typeId!: number;
  idc!: string;
  fullName!: string;
  comments!: string;
  isSelectionable!: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
