export class MultiplePaymentsUpdateResult {
    totalAmount: any;
    multiplePayments!: MultiplePaymentUpdateResult[];
}

export class MultiplePaymentUpdateResult {
    multiplePaymentId!: number;
    newAmount!: number;
    previusAmount!: number;
    message!: string;
}
