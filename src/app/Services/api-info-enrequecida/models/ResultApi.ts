export interface ResultAPI {
    data?:    ResultData;
    state?:   string;
    message?: string;
}

export interface ResultData {
    accountHolder?:     string;
    cic?:               string;
    status?:            string;
    statusDescription?: string;
    product?:           string;
    accountNumber?:     string;
    accountType?:       string;
    currency?:          string;
    endingBalance?:     number;
    initialBalance?:    number;
    period?:            string;
    transactions?:      ResultTransaction[];
}

export interface ResultTransaction {
    id:                  number;
    date:                string;
    hour:                string;
    hostOperationNumber: string;
    description:         string;
    channel:             string;
    gloss:               string;
    location:            string;
    amount:              number;
    agencyBranch:        string;
    teti:                string;
    valuta:              string;
    user:                string;
    utc:                 string;
}
