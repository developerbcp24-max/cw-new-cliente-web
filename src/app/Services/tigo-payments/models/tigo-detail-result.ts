import { TigoDetailPaymentDto } from "./tigo-dto";
import { UserInvolved } from "../../shared/models/user-involved";

export class TigoDetailResult {
    processBatchId!: number;
    accountNumber!: string;
    amount!: number;
    Currency!: string;
    carameters!: string;
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
    isComission!: boolean;
    zoneOrNeighborhood!: string;
    Detail: TigoDetailPaymentDto [] = [];
    UserInvolveds: UserInvolved [] = [];
}