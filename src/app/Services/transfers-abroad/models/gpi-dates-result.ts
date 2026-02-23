export class GpiDatesResult {
    message!: string;
    receptionSequence!: string;
    emissionDate!: string;
    emissionHour!: string;
    receptionDate!: string;
    receptionHour!: string;
    status!: string;
    sender!: string;
    countryReceiver!: string;
    cityReceiver!: string;
    bankReceiver!: string;
    reference!: string;
    relatedReference!: string;
    date!: string;
    codes!: string;
    codeDescription!: string;
    countryBIC!: string;
    cityBIC!: string;
    bankBIC!: string;
    crediCurrency!: string;
    creditAmount!: number;
    expenses!: string;
    currencyTCOne!: string;
    currencyTCTwo!: string;
    amountTC!: number;
    currencyAmountOne!: string;
    amountOne!: number;
    currencyAmountTwo!: string;
    amountTwo!: number;
    currencyAmountThree!: string;
    amountThree!: number;
    currencyAmountFour!: string;
    amountFour!: number;
    currencyAmountFive!: string;
    amountFive!: number;
    currencyAmountSix!: string;
    amountSix!: number;
    currencyAmountSeven!: string;
    amountSeven!: number;
    currencyAmountEight!: string;
    amountEight!: number;
    currencyAmountNine!: string;
    amountNine!: number;
    currencyAmountTen!: string;
    amountTen!: number;
    duplicateBroadcast!: string;
    duplicateMessage!: string;
    originalSequence!: string;
    registerDate!: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
