export class LexicoResult {
    id!: number;
    description!: string;
    group!: string;
    parameterId!: number;

constructor(values: Object = {}) {
    Object.assign(this, values);
}
          }