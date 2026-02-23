export class DocGenerationSignatureDigitalRequest {
  public affCompanyId?: string;
  public strIdClient?: string;
  public strIdDocument?: string;
  public nroOfLeaves?: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}