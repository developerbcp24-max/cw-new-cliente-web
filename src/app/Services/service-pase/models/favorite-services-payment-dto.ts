export class FavoriteServicesPaymentDto {
    companyCode!: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
