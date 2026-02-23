import { LexicoResult } from "./lexico-result";

export class LexicoGroup {
    nacionality: LexicoResult [] = [];
    country: LexicoResult [] = [];
    departament: LexicoResult [] = [];
    district: LexicoResult [] = [];
    province: LexicoResult [] = [];
    typeAddress: LexicoResult [] = [];
    countryResidence: LexicoResult [] = [];

constructor(values: Object = {}) {
    Object.assign(this, values);
}
          }