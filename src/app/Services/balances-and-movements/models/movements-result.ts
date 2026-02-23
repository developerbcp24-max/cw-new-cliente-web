export class MovementsResult {
    account!: AccountModel;
    movements!: MovementsModel[];
}

export class AccountModel {
    formattedNumber!: string;
    number!: string;
    owner!: string;
    application!: string;
    type!: string;
    currency!: string;
    status!: string;
    availableBalance!: number;
    overdraftBalance!: number;
    itfAmount!: number;
    inProgressOperations!: number;
}

export class MovementsModel {
    date!: Date;
    description!: string;
    amount!: number;
    accountingBalance!: number;
    availableBalance!: number;
    branch!: string;
    user!: string;
    transactionNumber!: string;
}
