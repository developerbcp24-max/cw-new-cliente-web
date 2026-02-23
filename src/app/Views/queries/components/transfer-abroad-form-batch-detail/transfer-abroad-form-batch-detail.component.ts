import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransfersAbroadService } from '../../../../Services/transfers-abroad/transfer-abroad.service';
import { TransferAbroadDetailResult } from '../../../../Services/transfers-abroad/models/transfer-abroad-detail-result';
import { GetTransferAbroadDto } from '../../../../Services/transfers-abroad/models/get-transfer-abroad-dto';
import { ParametersResult } from '../../../../Services/transfers-abroad/models/parameters-result';
import { ParameterASFIResult } from '../../../../Services/transfers-abroad/models/parameter-asfi-result';
import { AccountIdDto } from '../../../../Services/balances-and-movements/models/account-id-dto';
import { AccountsService } from '../../../../Services/accounts/accounts.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { CompleteAccountResult } from '../../../../Services/accounts/models/complete-account-result';
import { RequesterAbroadData } from '../../../../Services/transfers-abroad/models/requester-abroad-data';
import { BeneficiaryAbroadData } from '../../../../Services/transfers-abroad/models/beneficiary-abroad-data';
import { CategoryASFIData } from '../../../../Services/transfers-abroad/models/category-asfi.data';
import { DestinationBankResult } from '../../../../Services/transfers-abroad/models/destination-bank-result';
import { IntermediaryBank } from '../../../../Services/transfers-abroad/models/intermediary-bank';
import { CurrentUser } from '../../../../Services/users/models/current-user';
import { UserService } from '../../../../Services/users/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transfer-abroad-form-batch-detail',
  standalone: false,
  templateUrl: './transfer-abroad-form-batch-detail.component.html',
  styleUrls: ['./transfer-abroad-form-batch-detail.component.css'],
  providers: [TransfersAbroadService, AccountsService]

})
export class TransferAbroadFormBatchDetailComponent implements OnInit {

  @Input() batchId!: number;
  @Output() onClose = new EventEmitter();
  transferAbroadDetailResult: TransferAbroadDetailResult = new TransferAbroadDetailResult();
  parameters: ParametersResult = new ParametersResult();
  parametersASFIResult: ParameterASFIResult[] = [];
  currentUser: CurrentUser = new CurrentUser();

  requester: RequesterAbroadData = new RequesterAbroadData();
  beneficiary: BeneficiaryAbroadData = new BeneficiaryAbroadData();
  categoryAsfi: CategoryASFIData = new CategoryASFIData();
  payerBank: DestinationBankResult = new DestinationBankResult();
  intermediaryBank: IntermediaryBank = new IntermediaryBank();
  private CHARGE_SHARED = 'SHA';

  constructor(private transfersAbroadService: TransfersAbroadService,
    private accountService: AccountsService,
    private globalService: GlobalService,
    private userService: UserService) {
    this.currentUser = this.userService.getUserToken();
  }

  ngOnInit() {
    this.loadTransferAbroad(this.batchId);
  }

  loadTransferAbroad(batch: number) {
    const transferAbroadDto = new GetTransferAbroadDto();
    transferAbroadDto.batch = batch;
    const combined = forkJoin([
      this.transfersAbroadService.getParameters(),
      this.transfersAbroadService.getParametersASFI(),
      this.transfersAbroadService.getTransferAbroadDetail(transferAbroadDto)
    ]);
    combined.subscribe({next: (res: any[]) => {
      this.parameters = res[0];
      this.parametersASFIResult = res[1];
      this.transferAbroadDetailResult = res[2];
      this.LoadDataRequesterResult();
      this.LoadBeneficiaryResult(this.transferAbroadDetailResult);
      this.LoadCategoryAsfiResult(this.transferAbroadDetailResult);
      this.LoadPayerBankResult(this.transferAbroadDetailResult);
      this.LoadIntermediaryBankResult(this.transferAbroadDetailResult);
    }, error: _err => {
      this.globalService.danger('Error en el servicio', _err.message);
    }});
  }

  LoadDataRequesterResult() {
    const { transferAbroadDetailResult } = this;
    const accountIdDto: AccountIdDto = new AccountIdDto();
    accountIdDto.accountId = transferAbroadDetailResult.accountId;
    this.accountService.getById(accountIdDto)
      .subscribe({next: (res: CompleteAccountResult) => {
        const sourceAccountResult = res;
        this.requester = new RequesterAbroadData({
          address: transferAbroadDetailResult.requesterAddress,
          phone: transferAbroadDetailResult.requesterPhone,
          numberAccount: transferAbroadDetailResult.requesterNumberAccount,
          email: transferAbroadDetailResult.requesterEmail,
          transferReason: transferAbroadDetailResult.transferReason,
          destinationAmount: transferAbroadDetailResult.destinationAmount,
          isTicket: transferAbroadDetailResult.isTicket,
          ticket: transferAbroadDetailResult.isTicket ? transferAbroadDetailResult.numberTicket!.toString() : '',
          preferentialExchange: transferAbroadDetailResult.isTicket ? transferAbroadDetailResult.preferentialExchange : this.currentUser.exchange_sale + '(Actual)',
          ticketCommission: transferAbroadDetailResult.numberTicketCommission,
          currency: transferAbroadDetailResult.destinationCurrency,
          isTicketCommission: transferAbroadDetailResult.isTicketCommission,
          charge: transferAbroadDetailResult.detailCharges ? transferAbroadDetailResult.detailCharges : this.CHARGE_SHARED,
          commissionAmount: transferAbroadDetailResult.isTicketCommission ? transferAbroadDetailResult.commissionAmount.toString() : transferAbroadDetailResult.commissionTransfer.toString() + 'USD (tarifario)',
          ticketOtherCurrency: transferAbroadDetailResult.numberTicketOtherCurrency,
          isDiferentCurrency: transferAbroadDetailResult.currency !== sourceAccountResult.currency
        });
      }});
  }

  LoadBeneficiaryResult(beneficiaryDetail: TransferAbroadDetailResult) {
    const { beneficiary } = this;
    beneficiary.address = beneficiaryDetail.beneficiaryAddress;
    beneficiary.businessName = beneficiaryDetail.beneficiaryBusinessName;
    beneficiary.cityResidence = beneficiaryDetail.beneficiaryCityResidence;
    beneficiary.countryResidence = beneficiaryDetail.beneficiaryCountryResidence;
    beneficiary.documentType = beneficiaryDetail.beneficiaryDocumentType;
    beneficiary.email = beneficiaryDetail.beneficiaryEmail;
    beneficiary.numberAccount = beneficiaryDetail.beneficiaryNumberAccount;
    beneficiary.numberDocument = beneficiaryDetail.beneficiaryDocumentNumber;
    beneficiary.paymentConcept = beneficiaryDetail.beneficiaryPaymentConcept;
    beneficiary.phone = beneficiaryDetail.beneficiaryPhone;
  }

  LoadCategoryAsfiResult(categoryDetail: TransferAbroadDetailResult) {
    if (this.transferAbroadDetailResult.transferCategoryCode) {
      this.categoryAsfi = new CategoryASFIData();
      this.categoryAsfi.categoryASFI = new ParameterASFIResult();
      this.categoryAsfi.categoryASFI.categoryNemonId = categoryDetail.transferCategoryCode;
      this.categoryAsfi.categoryASFI.description = categoryDetail.transferCategory;
    }
    this.categoryAsfi.amountTransfer = this.transferAbroadDetailResult.amount;
    this.categoryAsfi.currency = this.transferAbroadDetailResult.currency;
  }

  LoadPayerBankResult(payerBankDetail: TransferAbroadDetailResult) {
    const { payerBank } = this;
    payerBank.address = payerBankDetail.payerBankAddress;
    payerBank.city = payerBankDetail.payerBankCity;
    payerBank.code = payerBankDetail.payerBankCodeSwift;
    payerBank.country = payerBankDetail.payerBankCountry;
    payerBank.fullData = payerBankDetail.payerBankFullData;
    payerBank.name = payerBankDetail.payerBankName;
  }

  LoadIntermediaryBankResult(intermediaryBankDetail: TransferAbroadDetailResult) {
    const { intermediaryBank } = this;
    intermediaryBank.isBankIntermediary = false;
    if (intermediaryBankDetail.intermediaryBankCodeSwift) {
      intermediaryBank.isBankIntermediary = true;
      intermediaryBank.numberAccount = intermediaryBankDetail.intermediaryBankNumberAccountPayer;
      intermediaryBank.destinationBankResult.address = intermediaryBankDetail.intermediaryBankAddress;
      intermediaryBank.destinationBankResult.address = intermediaryBankDetail.intermediaryBankAddress;
      intermediaryBank.destinationBankResult.city = intermediaryBankDetail.intermediaryBankCity;
      intermediaryBank.destinationBankResult.code = intermediaryBankDetail.intermediaryBankCodeSwift;
      intermediaryBank.destinationBankResult.country = intermediaryBankDetail.intermediaryBankCountry;
      intermediaryBank.destinationBankResult.fullData = intermediaryBankDetail.intermediaryBankFullData;
      intermediaryBank.destinationBankResult.name = intermediaryBankDetail.intermediaryBankName;
    }
  }

  handlePreview() {
    this.onClose.emit();
  }

}
