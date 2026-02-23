import { UserInvolved } from "../../shared/models/user-involved";
import { NewPaseDebtResult } from "./new-pase-debt-result";

export class NewPasePaymentDetailResult {
    processBatchId!: number;
    accountNumber!: string;
    amount!: number;
    currency!: string;
    serviceType!: string;
    isComission!: boolean;
    comisionDetail: ComisionDetail = new ComisionDetail();
    detail: NewPaseDebtResult [] = [];
    userInvolveds: UserInvolved [] = [];
 }
  export class ComisionDetail {
    nameBill!: string;
    nitFactura!: string;
    streetOrAvenue!: string;
    number!: string;
    floorOrDepartament!: string;
    batchOrCondominium!: string;
    zoneOrNeighborhood!: string;
    location!: string;
    province!: string;
    departament!: string;
    isStreet: any;
    constructor(values: Object = {}) {
      Object.assign(this, values);
  }
  }