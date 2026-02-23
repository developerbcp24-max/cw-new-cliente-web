export class RequestDto
{
    accountNumber?: string;
    accountType?: string;
    channelDate?: string;
    channelHour?: string;
    transactionType?: string;
    employeeFlag?: string;
    informationLevel?: string;
    period?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class RequestModelReportsApiInfo
{
    accountNumber?: string;
    accountType?: string;
    channelDate?: string;
    channelHour?: string;
    transactionType?: string;
    employeeFlag?: string;
    informationLevel?: string;
    period?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
