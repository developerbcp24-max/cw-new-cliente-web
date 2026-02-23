export class QrPaymentDetailResult {
    isOk!:    boolean;
    message!: null;
    body!:    Body;
}

export class Body {
    listQRPaymentDetail!: ListQRPaymentDetail[];
}

export class ListQRPaymentDetail {
    companyId!:        number;
    company!:          null;
    businessCode!:     string;
    abreviation!:      string;
    userName!:         string;
    userToken!:        string;
    atmCode!:          string;
    atmName!:          string;
    branchId!:         string;
    branchName!:       string;
    oldShareReport!:   boolean;
    userCreation!:     string;
    userModification!: string;
    dateCreation!:     Date;
    dateModification!: Date;
    isDeleted!:        boolean;
    id!:               number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
