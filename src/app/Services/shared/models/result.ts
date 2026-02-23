export class Result<T> {
  isOk: boolean = false;

  message: string | null = null;

  body: T | null = null;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
