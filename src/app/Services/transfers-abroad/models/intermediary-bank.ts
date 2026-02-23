import { DestinationBankResult } from './destination-bank-result';

export class IntermediaryBank {
    isBankIntermediary: boolean = false;
    numberAccount!: string;
    destinationBankResult: DestinationBankResult = new DestinationBankResult();
}
