export class RequestModelsAfpquery {
    IdCompany!:string;    
    IdClient!:string;
    Param1!:string;
    Param2!:string;//numero documento
    Param3!:string;//tipo de documento
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
