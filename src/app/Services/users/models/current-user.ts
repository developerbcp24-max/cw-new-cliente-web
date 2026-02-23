export class CurrentUser {
  unique_name!: string;
  role: any[] = [];
  company_id!: string;
  company_state: boolean = false;
  company_name!: string;
  user_document_number!: string;
  controller_scheme: boolean = false;
  user_type!: string;
  user_name!: string;
  exchange_buy!: string;
  exchange_sale!: string;
  authorize_pin: boolean = false;
  authorize_operation: boolean = false;
  authorize_ftp: boolean = false;
  is_signature: boolean = false;
  is_validbatchtoken!: boolean;
  nameid!: number;
  guid!: string;
}
