export class AgencyResult {
  agencyId!: number;
  agencyName!: string;
  branchOfficeId!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
