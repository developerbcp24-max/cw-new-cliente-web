import { SelectedVoucher } from "./selected-voucher";

export class VoucherDto {
    id!: number;
    operationTypeId!: number;
    nameOperation!: string;
    operationTypeDes!: string;
    numberTypeVoucher!: number;
    userCreationId!: number;
    txtName!: string;
    fileName!: string;
    transferTypeId!: number;
    userId!: string;
    isGenericPase!: boolean;

    arrayVoucher: Array<SelectedVoucher> = [];
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
