export class ApiInfoEnrequecida {
    data!:    Data;
    state!:   string;
    message!: string;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }

  export class Data {
    NumberRow?: number;
    RowIni?: any;
    accountHolder: string | undefined;
    cic?: string;
    status?: string;
    statusDescription?: string;
    product?: string;
    accountNumber?: string;
    accountType?: string;
    currency?: string;
    endingBalance?: number;
    initialBalance?: number;
    period?: string;
    transactions?: Transaction[];
  }

  export class Transaction {
    id!: number;
    date!: string;
    hour!: string;
    hostOperationNumber!: string;
    description!: string;
    channel!: string;
    gloss!: string;
    location!: string;
    amount!: number;
    agencyBranch!: string;
    teti!: string;
    valuta!: string;
    user!: string;
    utc!: string;
    emisorAccount!: string;
    emisor!: string;
    sourceBank!: string;

    TypeReport?: string;
    Currency?: string;
    statusDescription?: string;
    accountNumber?: string;
    endingBalance?: string;
  }

  export class ApiInfoReport
    {
         Company?: string;
         Service?: string;
         Description?: string;
         Amount?: string;
         Currency?: string;
         RegistrationAmount?: string;
}
