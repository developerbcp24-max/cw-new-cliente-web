import { ProcessBatchDto } from "../../shared/models/process-batch";

export class TigoDto extends ProcessBatchDto {
    isFavorite!: boolean;
    favoriteName!: string;
    parameters!: string;
    searchCode!: string;
    client = 'S/N';
    contract!: string;
    isComission = false;
    updateDates = false;
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
    detailPayments: TigoDetailPaymentDto [] = [];
}

export class TigoDetailPaymentDto {
    voucherType!: string;
    voucherSeries!: string;
    voucherNumber!: string;
    billingPeriod!: string;
    emissionDate!: string;
    endDate!: string;
    amount!: number;
    balance!: number;
    voucherStatus!: string;
}