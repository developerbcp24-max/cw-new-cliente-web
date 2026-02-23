export class CismartApproversValidationResult {
  errorMessage!: string;
  isValid!: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
