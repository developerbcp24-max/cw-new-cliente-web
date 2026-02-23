export class PaginationDto {
    rowIniAuthorize!: number;
    numberRowAuthorize!: number;
    rowIniController!: number;
    numberRowController!: number;
    rowIniPreSave!: number;
    numberRowPreSave!: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
