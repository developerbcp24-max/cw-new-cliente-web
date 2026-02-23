import { ParameterCurrencyResult } from './parameter-currency-result';
import { ParameterChargeResult } from './parameter-charge-result';
import { ParameterDocumentTypeResult } from './parameter-document-type-result';

export class ParametersResult {
    currencies: ParameterCurrencyResult[] = [];
    chargesType: ParameterChargeResult[] = [];
    documentsType: ParameterDocumentTypeResult[] = [];
}
