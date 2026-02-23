export class GetDatesDto {
  userName!: string;
  validationType!: number;
  code!: string;
  codeId!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
