import { ItemMultiplePaymentUpdate } from './item-multiple-payment-update';

export class MultiplePaymentUpdateDto {
    tokenCode!: string;
    tokenName!: string;
    multiplePayments!: ItemMultiplePaymentUpdate[];
}
