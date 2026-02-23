export class EventLogDto {
    userId!: number;
    module!: string;
    event!: string;
    eventDetail!: string;
    eventName!: string;
    eventType!: string;
    companyId!: number;
    sessionId!: string;
    previousDataUpdate!: string;
    browserAgentVersion!: string;
    sourceIP!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
