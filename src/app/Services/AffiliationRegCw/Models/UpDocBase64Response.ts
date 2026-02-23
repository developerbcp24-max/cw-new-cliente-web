export class UpDocBase64Response {
  public strIdDocument?: string;
  public NroOfLeaves?: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
