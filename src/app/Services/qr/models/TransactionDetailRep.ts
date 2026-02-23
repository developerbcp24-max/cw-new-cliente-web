
export class TransaccionDetailRep {
    currency!:         string;
    businessName!:     string;
    amount!:           number;
    gloss!:            string;
    idc!:              string;
    receiverName!:     string;
    receiverDocument!: string;
    receiverBank!:     string;
    originAccount!:    string;
    destinyAccount!:   string;
    branchOffice!:     string;
    city!:             string;
    atm!:              string;
    businessCode!:     string;
    operationNumber!:  string;
    transaccionDate!:  Date;
    DateFecha?: string = '';
    DateHour?: string = '';

    typeReport?: string;
    statusDescription?: string;
    accountNumber?: string;
}
