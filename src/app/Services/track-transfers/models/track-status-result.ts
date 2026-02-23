export class TrackStatusResult{
  id!: number;
  description!: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
