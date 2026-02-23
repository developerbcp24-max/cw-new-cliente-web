import { ProcessBatchDto } from "../../shared/models/process-batch";
import { FavoritePaymentDto } from "./favorite-payment-dto";
import { NewPasePaymentDto } from "./new-pase-payment-dto";

export class NewPaseDto extends ProcessBatchDto {
    isFavorite!: boolean;
    favoriteName!: string;
    companyCode!: string;
    isComission!: boolean;
    comissionAmount!: number;
    comissionCurrency!: string;
    nameBill!: string;
    nitFactura!: string;
    isStreet!: boolean;
    streetOrAvenue!: string;
    number!: string;
    floorOrDepartament!: string;
    batchOrCondominium!: string;
    zoneOrNeighborhood!: string;
    location!: string;
    province!: string;
    departament!: string;
    phoneNumber!: string;
    email!: string;
    billingType!: string;
    documentExtension: any;
    iDCComplement!: string;
    documentNumber!: string; 
    documentType: any;
    isGenericPayment!: boolean;
    favoritePayments: FavoritePaymentDto[] = [];
    newPasePayments: NewPasePaymentDto[] = [];
}