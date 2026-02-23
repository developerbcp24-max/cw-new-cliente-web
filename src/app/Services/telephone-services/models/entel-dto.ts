import { ProcessBatchDto } from "../../shared/models/process-batch";

export class EntelDto extends ProcessBatchDto {
    isComission = false;
    isFavorite!: boolean;
    favoriteName!: string;
    parameters!: string;
    searchCode!: string;
    name!: string;
    company!: string;
    idTransaction!: number;
    service!: string;
    serviceDescription!: string;
    serviceName!: string;
    paymentType!: string;
    paymentDescription!: string;
    nameBill!: string;
    nitFactura!: string;
    isStreet!: boolean;
    streetOrAvenue!: string;
    number!: string;
    floorOrDepartament!: string;
    batchOrCondominium!: string;
    location!: string;
    province!: string;
    departament!: string;
    zoneOrNeighborhood!: string;
    entelPaymentDetail: EntelDetailPaymentDto[] = [];
}

export class EntelDetailPaymentDto {
    item!: string;
    description!: string;
    amount!: number;
    agrupator!: string;
    numberBill!: string;
    nameBill!: string;
    nitBill!: string;
    dosificationBatch!: string;
    rentNumber!: string;
    period!: string;
    beneficiaryReason!: string;
    typeBill!: string;
    minAmount!: number;
    actualBalance!: number;
    departament!: string;
    city!: string;
    agency!: string;
    transactor!: string;
    observations!: string;
}