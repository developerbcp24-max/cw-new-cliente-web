import { BallotOfWarrantyAmortizationDto } from './ballot-of-warranty-amortization-dto';
import { BallotOfWarrantyBusinessOfficerDto } from './ballot-of-warranty-business-officer-dto';
import { BallotOfWarrantyPublicWritingDetailDto } from './ballot-of-warranty-public-writing-detail-dto';
import { BallotOfWarrantyContractRoeDto } from './ballot-of-warranty-contract-reo-dto';
import { ProcessBatchDto } from '../../shared/models/process-batch';

export class BallotOfWarrantyDto extends ProcessBatchDto {

  isValidRoe = false;
  nameFile!: string;
  uploadFile = true;
  saleExchangeRate!: number;
  isLegalPerson!: boolean;
  showRoe!: boolean;
  isPercent!: boolean;
  typeBallot!: boolean;
  personType!: string;
  personTypeDescription!: string;
  address!: string;
  typeBallotOfWarranty!: string;
  typeBallotDescription!: string;
  annualIncome: number;
  heritage!: number;
  numberOfEmployees: number;
  civilState = '';
  civilStateDescription!: string;
  literalAmount!: string;
  termInDays!: number;
  startDate!: Date;
  expirationDate!: Date;
  modality!: string;
  isMAU!: boolean;
  beneficiary!: string;
  object = '';
  objectSpecification!: string;
  objectDescription!: string;
  objectOtherDescription!: string;
  accountDebitId!: number;
  formattedAccountDebit!: string;
  formattedAccountPDF!: string;
  statusRenovation!: boolean;
  numberRenovation!: string;
  typeWarranty = '';
  typeWarrantyDescription!: string;
  amountWarranty!: number;
  originator!: string;
  accountNumberId!: number;
  bank!: string;
  numberDPF!: string;
  firstTitular!: string;
  firstDocumentCI!: string;
  secondTitular!: string;
  secondDocumentCI!: string;
  thirdTitular!: string;
  thirdDocumentCI!: string;
  entityName!: string;
  entityDocumentCI!: string;
  additionalClause!: boolean;
  ipRequest!: string;
  reasonForRejection!: string;
  dateRejection!: Date;
  userRejection!: string;
  token!: string;
  numberTarget!: string;
  numberBallot!: string;
  cupRate!: number;
  numberWarranty!: string;
  placeOfIssue!: string;
  placeOfDelivery = '';
  placeOfDeliveryDescription!: string;
  comissionType!: string;
  preferentialComissionType!: string;
  nameThirdPerson!: string;
  documentCIThirdPerson!: string;
  agency!: string;
  publicWritingDetails: BallotOfWarrantyPublicWritingDetailDto[] = [];
  amortizations: BallotOfWarrantyAmortizationDto[] = [];
  businessOfficers: BallotOfWarrantyBusinessOfficerDto[] = [];
  contractRoe!: BallotOfWarrantyContractRoeDto;
  isRoe = false;

  constructor() {
    super();
    this.annualIncome = null!;
    this.amount = null!;
    this.numberOfEmployees = null!;
  }

}
