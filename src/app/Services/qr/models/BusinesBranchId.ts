import { GetUserQrOption } from "./GetUserQrOption";

export class BusinesBranchId
{
    businessId: number = 0;
    branchId: number = 0;
    ListBranch: string ='';
    option: GetUserQrOption = 0;
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
