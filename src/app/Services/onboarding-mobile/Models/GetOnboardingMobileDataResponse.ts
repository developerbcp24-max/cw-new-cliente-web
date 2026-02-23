export class GetOnboardingMobileDataResponse {
  affCompanyId: string = '';

  affiliationDocument: string = '';

  affiliateUserEmail: string = '';

  companyName: string = '';

  affiliateIdc: string = '';

  affiliateIdcType: string = '';

  affiliateIdcExtension: string = '';

  affiliateIdcComplement: string = '';

  affiliatePhone: string = '';

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
