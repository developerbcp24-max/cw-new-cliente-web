export interface ResponsDto {
    data?:    Data;
    state?:   string;
    message?: string;
}

export interface Data {
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
    transactions?:      Transaction[];
}

export interface Transaction {
    id?:                  number;
    date?:                string;
    hour?:                string;
    hostOperationNumber?: string;
    description?:         string;
    channel?:             string;
    gloss?:               string;
    location?:            string;
    amount?:              number;
    agencyBranch?:        string;
    teti?:                string;
    valuta?:              string;
    user?:                string;
    utc?:                 string;
}
