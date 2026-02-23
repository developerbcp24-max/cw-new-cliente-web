export class GetCodeOTPResult {
  codeId!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
