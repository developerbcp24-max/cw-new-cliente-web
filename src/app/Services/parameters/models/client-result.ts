import { ClientRequest } from "./client-request";
import { LexicoResult } from "./lexico-result";

export class ClientResult {
  isUpdate!: boolean;
     clientDto!: ClientRequest;
     parameterResult: LexicoResult [] = [];
    
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
    
  }