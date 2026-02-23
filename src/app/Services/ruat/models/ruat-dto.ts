export class RuatDto {
  criteria?: string;
  documentNumber?: string;
  documentType?: string;
  documentExtension?: string;
  identifier!: string;
  cityHallCode?: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
