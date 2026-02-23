export class MassivePaymentsPreviousFormDto{
  OperationType: number =0;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
