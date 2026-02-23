import { CompanyInformation } from "./company-information";
import { User } from "./user";
import { UserRole } from "./user-role";
import { ProcessBatchDto } from "../../../shared/models/process-batch";
import { OperationTypeResult } from "./operation-type-result";

export class OriginalData extends ProcessBatchDto {
  override id: number = 0;
  operation!: number;
  companyInformations: CompanyInformation = new CompanyInformation();
  users: User[] = [];
  userRoles: UserRole[] = [];
  operationTypesDetail: OperationTypeResult [] = [];
}
