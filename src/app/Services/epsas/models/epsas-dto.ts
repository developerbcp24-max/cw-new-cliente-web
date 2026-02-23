import { EpsasPaymentDto } from "./epsas-payment-dto";

export class EpsasDto {
    parameters!: string;
    codeCriteria!: string;
    isFavorite!: boolean;
    favoriteName!: string;
    epsasPaymentDto: EpsasPaymentDto [] = [];
}

