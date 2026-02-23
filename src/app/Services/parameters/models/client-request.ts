export class ClientRequest {

    adress!: string;
    phoneNumber!: string;
    cellPhoneNumber!: string;
    workPlace!: string;
    nationalityId!: number;
    departamentId!: number;
    districtId!: number;
    provinceId!: number;
    typeAddressId!: number;
    number!: string;
    countryResidenceId!: number;
    cic!: string;
    typeIdc!: string;
    
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }