export class ResponseModelDate {

    public description!: string;
    public id_Month!: string;
    public dateIni!: string;
    public dateEnd!: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}