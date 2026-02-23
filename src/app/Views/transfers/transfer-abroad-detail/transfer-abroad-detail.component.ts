import { Component, OnInit } from '@angular/core';
import { TransfersAbroadService } from '../../../Services/transfers-abroad/transfer-abroad.service';
import { ParametersResult } from '../../../Services/transfers-abroad/models/parameters-result';
import { ConfigurationsParameter } from '../../../Services/transfers-abroad/models/configurations-parameter';
import { Router } from '@angular/router';
import { GetTransferAbroadDto } from '../../../Services/transfers-abroad/models/get-transfer-abroad-dto';
import { ParameterASFIResult } from '../../../Services/transfers-abroad/models/parameter-asfi-result';
import { DestinationBankResult } from '../../../Services/transfers-abroad/models/destination-bank-result';
import { IntermediaryBank } from '../../../Services/transfers-abroad/models/intermediary-bank';
import { RequesterAbroadData } from '../../../Services/transfers-abroad/models/requester-abroad-data';
import { TransferAbroadDetailResult } from '../../../Services/transfers-abroad/models/transfer-abroad-detail-result';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../../../Services/users/user.service';
import { CurrentUser } from '../../../Services/users/models/current-user';
import { AccountsService } from '../../../Services/accounts/accounts.service';
import { AccountIdDto } from '../../../Services/balances-and-movements/models/account-id-dto';
import { GlobalService } from '../../../Services/shared/global.service';
import { CompleteAccountResult } from '../../../Services/accounts/models/complete-account-result';
import { CategoryASFIData } from '../../../Services/transfers-abroad/models/category-asfi.data';
import { TransferAbroadDetailDto } from '../../../Services/transfers-abroad/models/transfer-abroad-detail-dto';
import { BeneficiaryAbroadData } from '../../../Services/transfers-abroad/models/beneficiary-abroad-data';
import { ProcessBatchResult } from '../../../Services/shared/models/process-batch-result';
import { TransferAbroadFrecuent } from '../../../Services/transfers-abroad/models/transfer-abroad-frecuent';
import { TransferAbroadFrecuentResult } from '../../../Services/transfers-abroad/models/transfer-abroad-frecuent-result';
import { DataService } from '../../../Services/shared/data.service';
@Component({
  selector: 'app-transfer-abroad-detail',
  standalone: false,
  templateUrl: './transfer-abroad-detail.component.html',
  styleUrls: ['./transfer-abroad-detail.component.css'],
  providers: [TransfersAbroadService, AccountsService]
})
export class TransferAbroadDetailComponent implements OnInit {

  batch!: number;
  isFrecuentTransfer = false;
  isFrecuentTransferSave = false;
  disabledAddFrecuentTransfer = false;
  transferAbroadDetailDto: TransferAbroadDetailDto = new TransferAbroadDetailDto();
  parameters: ParametersResult = new ParametersResult();
  parametersASFIResult: ParameterASFIResult[] = [];
  configurationsParameter: ConfigurationsParameter = new ConfigurationsParameter();
  transferAbroadDetailResult: TransferAbroadDetailResult = new TransferAbroadDetailResult();
  payerBank: DestinationBankResult = new DestinationBankResult();
  intermediaryBank: IntermediaryBank = new IntermediaryBank();
  currentUser: CurrentUser = new CurrentUser();
  sourceAccount: CompleteAccountResult = new CompleteAccountResult();
  requester: RequesterAbroadData = new RequesterAbroadData();
  beneficiary: BeneficiaryAbroadData = new BeneficiaryAbroadData();
  categoryAsfi: CategoryASFIData = new CategoryASFIData();
  transferAbroadFrecuent: TransferAbroadFrecuent = new TransferAbroadFrecuent();
  isVisibleInfoModal = false;
  private CHARGE_SHARED = 'SHA';

  constructor(private transfersAbroadService: TransfersAbroadService,
    private userService: UserService,
    private accountService: AccountsService,
    private globalService: GlobalService,
    private route: Router,
    private dataService: DataService) { }

  ngOnInit() {
    if (this.dataService.serviceData) {
      this.batch = +this.dataService.serviceData;
    } else {
      this.route.navigate(['/transfers/transfer-abroad']);
      return;
    }
    this.currentUser = this.userService.getUserToken();
    this.loadTransferAbroad(this.batch);
  }

  loadTransferAbroad(batch: number) {
    const transferAbroadDto = new GetTransferAbroadDto();
    transferAbroadDto.batch = batch;
    const combined = forkJoin([
      this.transfersAbroadService.getParameters(),
      this.transfersAbroadService.getConfigurationParameters(),
      this.transfersAbroadService.getParametersASFI(),
      this.transfersAbroadService.getTransferAbroadDetail(transferAbroadDto)
    ]);

    combined.subscribe({next: (res: any[]) => {
      this.parameters = res[0];
      this.configurationsParameter = res[1];
      this.parametersASFIResult = res[2];
      this.transferAbroadDetailResult = res[3];
      this.LoadDataRequesterResult();
      this.LoadCategoryAsfiResult(this.transferAbroadDetailResult);
      this.LoadBeneficiaryResult(this.transferAbroadDetailResult);
      this.LoadPayerBankResult(this.transferAbroadDetailResult);
      this.LoadIntermediaryBankResult(this.transferAbroadDetailResult);
      this.LoadTransferFrecuentResult(this.transferAbroadDetailResult.transferAbroadFrecuentResult);
    }, error: _err => {
      this.globalService.danger('Error en el servicio', _err.message);
    }});
  }

  handlePayerBank($event: DestinationBankResult) {
    this.payerBank = $event;
  }

  handleIntermediaryBank($event: IntermediaryBank) {
    this.intermediaryBank = $event;
  }

  handleChangeCategory($event: CategoryASFIData) {
    this.categoryAsfi = $event;
  }

  LoadDataRequesterResult() {
    const { transferAbroadDetailResult } = this;
    const accountIdDto: AccountIdDto = new AccountIdDto();
    accountIdDto.accountId = transferAbroadDetailResult.accountId;
    this.accountService.getById(accountIdDto)
      .subscribe((res: CompleteAccountResult) => {
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
          commissionAmount: transferAbroadDetailResult.isTicketCommission ? transferAbroadDetailResult.commissionAmount.toString() + ' USD' : transferAbroadDetailResult.commissionTransfer.toString() + ' USD (tarifario)',
          commissionOur: transferAbroadDetailResult.isTicketCommission ? transferAbroadDetailResult.amountTicketCommissionOur.toString() + ' USD' : transferAbroadDetailResult.commissionOur.toString() + ' USD',
          ticketOtherCurrency: transferAbroadDetailResult.numberTicketOtherCurrency,
          isDiferentCurrency: transferAbroadDetailResult.currency !== sourceAccountResult.currency
        });
        this.showAlert();
      });
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

  LoadTransferFrecuentResult(frecuent: TransferAbroadFrecuentResult) {
    if (frecuent) {
      this.disabledAddFrecuentTransfer = true;
      this.transferAbroadFrecuent.isFrecuent = true;
      this.transferAbroadFrecuent.description = frecuent.description;
      this.transferAbroadFrecuent.processBatchId = frecuent.processBatchId;
    }
  }

  validateForms(isValidRequester: any
    , isValidVeneficiary: any
    , isValidCategoryAsfi: any
    , isValidPayerBank: any
    , isValidIntermediaryBank: any) {
    return isValidRequester
      && isValidVeneficiary
      && isValidCategoryAsfi
      && isValidPayerBank
      && isValidIntermediaryBank;
  }

  handleSubmitDetail() {
    const { transferAbroadDetailDto } = this;
    transferAbroadDetailDto.processBatchId = this.batch;
    this.LoadRequesterDto();
    this.LoadBeneficiaryDto();
    this.LoadCategoryAsfiDto();
    this.LoadPayerBankDto();
    this.LoadIntermediaryBankDto();
    this.LoadFrecuentTransferDto();
    this.transfersAbroadService
      .saveTransferDetail(this.transferAbroadDetailDto)
      .subscribe({next: (res: ProcessBatchResult) => {
        if (this.isFrecuentTransferSave) {
          this.route.navigate(['/transfers/transfer-abroad']);
        } else {
          this.dataService.serviceData = res.processBatchId;
          this.route.navigate(['/transfers/transfer-abroad-confirm']);
        }
      }, error: _err => {
        this.globalService.danger('Servicio de transferencia al exterior', _err.message);
      }});
  }

  LoadRequesterDto() {
    const { transferAbroadDetailDto, requester, transferAbroadDetailResult } = this;
    transferAbroadDetailDto.requesterAddress = requester.address;
    transferAbroadDetailDto.requesterEmail = requester.email;
    transferAbroadDetailDto.requesterNumberAccount = requester.numberAccount;
    transferAbroadDetailDto.requesterPhone = requester.phone;
    transferAbroadDetailDto.transferReason = requester.transferReason;
    if (!transferAbroadDetailResult.isTicketCommission) {
      transferAbroadDetailDto.detailCharges = requester.charge;
    }
  }

  LoadBeneficiaryDto() {
    const { transferAbroadDetailDto, beneficiary } = this;
    transferAbroadDetailDto.beneficiaryBusinessName = beneficiary.businessName;
    transferAbroadDetailDto.beneficiaryAddress = beneficiary.address;
    transferAbroadDetailDto.beneficiaryCityResidence = beneficiary.cityResidence;
    transferAbroadDetailDto.beneficiaryCountryResidence = beneficiary.countryResidence;
    transferAbroadDetailDto.beneficiaryDocumentNumber = beneficiary.numberDocument;
    transferAbroadDetailDto.beneficiaryDocumentType = beneficiary.documentType;
    transferAbroadDetailDto.beneficiaryEmail = beneficiary.email;
    transferAbroadDetailDto.beneficiaryNumberAccount = beneficiary.numberAccount;
    transferAbroadDetailDto.beneficiaryPaymentConcept = beneficiary.paymentConcept;
    transferAbroadDetailDto.beneficiaryPhone = beneficiary.phone;
  }

  LoadCategoryAsfiDto() {
    const { transferAbroadDetailDto } = this;
    transferAbroadDetailDto.transferCategoryCode = this.categoryAsfi.categoryASFI.categoryNemonId;
    transferAbroadDetailDto.transferCategory = this.categoryAsfi.categoryASFI.description;
  }

  LoadPayerBankDto() {
    const { transferAbroadDetailDto, payerBank } = this;
    transferAbroadDetailDto.payerBankAddress = payerBank.address;
    transferAbroadDetailDto.payerBankCity = payerBank.city;
    transferAbroadDetailDto.payerBankCountry = payerBank.country;
    transferAbroadDetailDto.payerBankFullData = payerBank.fullData;
    transferAbroadDetailDto.payerBankName = payerBank.name;
    transferAbroadDetailDto.payerBankCodeSwift = payerBank.code;
  }

  LoadIntermediaryBankDto() {
    const { transferAbroadDetailDto, intermediaryBank } = this;
    if (intermediaryBank.isBankIntermediary) {
      transferAbroadDetailDto.intermediaryBankAddress = intermediaryBank.destinationBankResult.address;
      transferAbroadDetailDto.intermediaryBankCity = intermediaryBank.destinationBankResult.city;
      transferAbroadDetailDto.intermediaryBankCountry = intermediaryBank.destinationBankResult.country;
      transferAbroadDetailDto.intermediaryBankFullData = intermediaryBank.destinationBankResult.fullData;
      transferAbroadDetailDto.intermediaryBankName = intermediaryBank.destinationBankResult.name;
      transferAbroadDetailDto.intermediaryBankCodeSwift = intermediaryBank.destinationBankResult.code;
      transferAbroadDetailDto.intermediaryBankNumberAccountPayer = intermediaryBank.numberAccount;
    }
  }

  LoadFrecuentTransferDto() {
    if (!this.isFrecuentTransferSave && this.transferAbroadFrecuent.isFrecuent) {
      this.transferAbroadDetailDto.isFrecuent = true;
      this.transferAbroadDetailDto.processBatchFrecuentId = this.batch;
      this.transferAbroadDetailDto.description = this.transferAbroadFrecuent.description;
    }
  }

  handleChangeFrecuentTransfer($event: any) {
    this.isFrecuentTransfer = true;
    const transferAbroadDto = new GetTransferAbroadDto();
    transferAbroadDto.batch = $event.processBatchId;
    this.transfersAbroadService
      .getTransferAbroadDetail(transferAbroadDto)
      .subscribe({next: (res: TransferAbroadDetailResult) => {
        this.LoadFrecuentResult(res);
      }});
  }

  LoadFrecuentResult(frecuent: TransferAbroadDetailResult) {
    this.LoadDataRequesterFrecuentResult(frecuent);
    this.LoadCategoryAsfiResult(frecuent);
    this.LoadBeneficiaryResult(frecuent);
    this.LoadPayerBankResult(frecuent);
    this.LoadIntermediaryBankResult(frecuent);
  }

  LoadDataRequesterFrecuentResult(frecuent: TransferAbroadDetailResult) {
    const { transferAbroadDetailResult } = this;
    this.requester = new RequesterAbroadData({
      address: frecuent.requesterAddress,
      phone: frecuent.requesterPhone,
      numberAccount: transferAbroadDetailResult.requesterNumberAccount,
      email: frecuent.requesterEmail,
      transferReason: frecuent.transferReason,
      destinationAmount: transferAbroadDetailResult.destinationAmount,
      isTicket: transferAbroadDetailResult.isTicket,
      ticket: transferAbroadDetailResult.isTicket ? transferAbroadDetailResult.numberTicket!.toString() : '',
      preferentialExchange: transferAbroadDetailResult.isTicket ? transferAbroadDetailResult.preferentialExchange : this.currentUser.exchange_sale + '(Actual)',
      ticketCommission: transferAbroadDetailResult.numberTicketCommission,
      currency: transferAbroadDetailResult.destinationCurrency,
      isTicketCommission: transferAbroadDetailResult.isTicketCommission,
      charge: transferAbroadDetailResult.detailCharges ? transferAbroadDetailResult.detailCharges : this.CHARGE_SHARED,
      commissionAmount: transferAbroadDetailResult.isTicketCommission ? transferAbroadDetailResult.commissionAmount.toString() : transferAbroadDetailResult.commissionTransfer.toString() + 'USD (tarifario)',
      commissionOur: transferAbroadDetailResult.isTicketCommission ? transferAbroadDetailResult.amountTicketCommissionOur.toString() + ' USD' : transferAbroadDetailResult.commissionOur.toString() + ' USD',
      ticketOtherCurrency: transferAbroadDetailResult.numberTicketOtherCurrency,
      isDiferentCurrency: transferAbroadDetailResult.currency
    });
  }

  handleUpdateFrecuent($event: TransferAbroadFrecuentResult) {
    this.transferAbroadDetailDto.isFrecuent = true;
    this.transferAbroadDetailDto.processBatchFrecuentId = $event.processBatchId;
    this.isFrecuentTransferSave = true;
    this.handleSubmitDetail();
  }

  showAlert() {
    if ((!this.requester.isTicket && this.requester.isDiferentCurrency) || !this.requester.isTicketCommission) {
      this.isVisibleInfoModal = true;
    } else {
      this.isVisibleInfoModal = false;
    }
  }

  handleCloseAlert() {
    this.isVisibleInfoModal = false;
  }
}
