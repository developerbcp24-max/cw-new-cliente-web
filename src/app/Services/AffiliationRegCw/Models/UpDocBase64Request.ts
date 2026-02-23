export class UpDocBase64Request {
  public affCompanyId?: string;
  public strIdClient?: string;
  public strDocumentBase64?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
