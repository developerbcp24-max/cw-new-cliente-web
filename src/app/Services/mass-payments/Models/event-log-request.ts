export class EventLogRequest {
    userName!: string;
    module!: string;
    event!: string;
    eventDetail!: string;
    eventName!: string;
    eventType!: string;
    previousData!: string;
    updateData!: string;
    browserAgentVersion!: string;
    sourceIP!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
