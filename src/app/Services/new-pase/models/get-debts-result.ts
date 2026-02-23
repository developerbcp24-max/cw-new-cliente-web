export class GetDebtsResult {
    clientName!: string;
    paymentDescription!: string;
    datilPaymentId!: string;
    minimunPayment!: boolean;
    totalAmount!: number;
    currency!: string;
    clientCode!: string;
    contract!: string;
    debts: Debt [] = [];
    quotaNumber: any;
    punishAmount: any;
    endDate: any;
    period: any;
    isSelected: any;
    amount!: any;
    }

export class Debt {
    quotaNumber!: number;
    isEditable!: boolean;
    paymentInformation: string [] = [];
    information?: string;
    period!: string;
    endDate!: string;
    amount!: number;
    isSelected!: boolean;
    punishAmount!: number;
    currency!: string;
    billNumber!: string;
    minimumAmount!: number;
    billingType!: string;
    paymentDescription: any;

    totalAmount: any;
}