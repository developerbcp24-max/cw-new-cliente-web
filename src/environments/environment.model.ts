export interface ApiBaseUrls {
  AccountsServiceUrl: string;
  ApproversAndControllersServiceUrl: string;
  AuthorizationServiceUrl: string;
  AuthUrl: string;
  NewAuthUrl: string;
  BalancesAndMovementsServiceUrl: string;
  CashPaymentServiceUrl: string;
  ClaimRequestUrl: string;
  CreditCardsServiceUrl: string;
  CreditsServiceUrl: string;
  ExchangeRatesServiceUrl: string;
  FavoriteTransfersServiceUrl: string;
  FavoritePaymentServiceUrl: string;
  FavoritePaymentConfigServiceUrl: string;
  LimitsServiceUrl: string;
  MovementsAndDepositsUrl: string;
  MultiplePaymentServiceUrl: string;
  ParametersServiceUrl: string;
  PaseUrl: string;
  PaymentTaxCheckUrl: string;
  ProvidersCheckManagementUrl: string;
  ProvidersDepositInOtherBankCheckUrl: string;
  ProvidersPaymentsServiceUrl: string;
  RuatServiceUrl: string;
  SalariesPaymentServiceUrl: string;
  ServicePaymentsServiceUrl: string;
  TransfersAbroadServiceUrl: string;
  TransfersServiceUrl: string;
  TicketsServiceUrl: string;
  TokensServiceUrl: string;
  UrlListHistorical: string;
  PaymentAchUrl: string;
  PaymentOddAchUrl: string;
  VoucherElectronicUrl: string;
  ChecksServiceUrl: string;
  TrackTransfersUrl: string;
  ElectronicBillUrl: string;
  VouchersUrl: string;
  VouchersUrlV3: string;
  VouchersByOperationUrl: string;
  ModificationRequestUrl: string;
  AFPUrl: string;
  OldVouchersUrl: string;
  UIFServiceUrl: string;
  BallotOfWarrantyUrl: string;
  ElfecUrl: string;
  ServicePaseUrl: string;
  VouchersZipUrl: string;
  OTPUrl: string;
  OtpIamUrl: string;
  VouchersByBatchUrl: string;
  telephoneServiceUrl: string;
  tigoPaymentUrl: string;
  NewPaseUrl: string;
  CashPaymentOnlineServiceUrl: string;
  EventLogServiceUrl: string;
  QrPaymentServiceUrl: string;
  NewBallotOfWarrantyUrl: string;
  SoliPaymentServiceUrl: string;
  ApiInfoEnrequecidaUrl: string;
  RegBoQrServicesUrl: string;
  DBFDMonitor: string;
  AffiliationUserCwUrl: string;
  NewOtpUrl: string;
  NewTrackTrackingUrl: string;
  FxServices: string;
  AuthUrlSession: string;
  AuthUrlLegacy: string;
  RedirectLegacyCwUrl: string;
  QrPaymentAchServiceUrl: string;
  EpsasUrl: string;
  [key: string]: string; // Para propiedades adicionales
}

export interface Banquero {
  id: number;
  name: string;
  currency: string;
  bicSwift: string;
  country: string;
  accountNumber: string;
}

export interface StateQR {
  value: string;
  description: string;
}

export interface OnboardingMobile {
  GetOnboardingMobileDataUrl: string;
  CreateDigitalFileAndSendOTPUrl: string;
  ValidateOTPDigitalFileUrl: string;
  GetRespPassiveLiveTestUrl: string;
  GetValidatePassiveLiveTestUrl: string;
  DigitalFileReSendOTPUrl: string;
  SaveFinalDataToCWAffUrl: string;
}

export interface EnvironmentConfig {
  production: boolean;
  envName: string;
  apiBaseUrls: ApiBaseUrls;
  ComicionConfianza: number;
  Banquero: Banquero;
  padTokenLength: string;
  padTokenVULength: string;
  showMessageInitial: boolean;
  validateCaptcha: boolean;
  messageIsBlocked: string;
  ClientId: string;
  publicKeyRecaptcha: string;
  MessageQR: string;
  EncryptKey: string;
  ThumbPrintKey: string;
  isRecaptcha: boolean;
  validateProdem: boolean;
  isUif: boolean;
  showOriginDestinationFunds: boolean;
  showServicePase: boolean[];
  showGPI: boolean;
  showYPFB: boolean;
  showNewService: boolean;
  redirectionUrl: string;
  redirectionMinutes: number;
  logoutSeconds: number;
  validateHash: boolean;
  isEncrypt: boolean;
  maxLength: number;
  isValidateIP: boolean;
  validateSession: boolean;
  validateSesionTime: boolean;
  DaysQrReport: number;
  CompaniesReporteNewQR: string;
  StateQR: StateQR[];
  isTokenVU: boolean;
  IsNewJwt: boolean;
  IsPasswordNewJwt: boolean;
  OBUser: string;
  OBChannel: string;
  OBPassword: string;
  OBAppUserId: string;
  OBPublicToken: string;
  OnboardingMobile: OnboardingMobile;
}
