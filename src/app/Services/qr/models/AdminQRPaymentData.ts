import { ClientResponseUser } from "./ClientResponseUser";
import { RequestCaja } from "./RequestCaja";
import { RequestSucursal } from "./RequestSucursal";

export class AdminQRPaymentData{
  typeUser: string ='';
  roleCode: string= '';
  businessCode: string ='';
  clientResponseUser: ClientResponseUser[]=[];
  branchReq: RequestSucursal[]=[];
  cajaRequest: RequestCaja[]=[];
}
