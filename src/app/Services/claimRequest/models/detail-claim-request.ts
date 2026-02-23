export class DetailClaimRequest {
    ProductName!: string;
    AccountNumber!: string;
    ClaimType?: string;
    ServiceName!: string;
    Amount?: number;
    Currency?: string;
    TransactionDate?: Date;
    TransactionTime?: string;
    Description!: string;
    CardNumber!: string;
    Fax!: string;
    Phone!: string;
    CellPhone!: string;
    Email!: string;
    Address!: string;
    Department!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
