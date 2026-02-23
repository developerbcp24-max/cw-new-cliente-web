import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { Router, NavigationEnd } from '@angular/router';
import { UtilsService } from '../../../Services/shared/utils.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { AfpService } from '../../../Services/AFP/afp.service';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { AFPPayment } from '../../../Services/AFP/Models/PaymentAFP';
import { Constants } from '../../../Services/shared/enums/constants';
import { EmailInputModel } from '../../../Services/shared/models/email-input-model';
import { ResponseModelsAfpquery } from '../../../Services/AFP/Models/response-models-afpquery';
import { PaymentAFP } from '../../../Services/AFP/Models/response-models-afpquery';
import { DetailAFPDto } from '../../../Services/AFP/Models/response-models-afpquery';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { CurrencyAndAmountComponent } from '../../shared/cw-components/currency-and-amount/currency-and-amount.component';

@Component({
  selector: 'app-afp',
  standalone: false,
  templateUrl: './afp.component.html',
  styleUrls: ['./afp.component.css'],
  providers: [UtilsService, AfpService]
})
export class AfpComponent implements OnInit {

  isValidFunds = false;
  showFunds = false;
  showMessageIsBlock = false;
  accountDto!: AccountDto;
  account!: AccountResult;
  processBatchNumber!: number;
  approversDto: InputApprovers;
  disabled!: boolean;
  paymentInformation: AFPPayment = new AFPPayment();
  excedeedAmount = false;
  isVisibleToken = false;
  isDisabledForm = false;
  isVisible = false;
  Totalaccount!: number;
  isPaymentSuccessful = false;
  isTokenFormDisabled = false;
  successfulPaymentMessage = Constants.successfulTransactionMessage;
  ResponseModelsAfp: ResponseModelsAfpquery = new ResponseModelsAfpquery();
  @ViewChild(ApproversAndControllersComponent)
  approversComponent!: ApproversAndControllersComponent;
  @ViewChild(CurrencyAndAmountComponent)
  currencyUif!: CurrencyAndAmountComponent;

  isVisibleError = false;
  message!: string;
  constants: Constants = new Constants();
  isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;

  currencyAndAmountValidation!: boolean;
  sourceAccountValidation!: boolean;
  approversAndControllersValidation!: boolean;
  approversLimitValidation!: boolean;
  showModalPreSave = false;

  constructor(router: Router, private utilsService: UtilsService, private messageService: GlobalService,
    private serviceAFP: AfpService) {
    this.approversDto = new InputApprovers();
    router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    router.events.subscribe({next: (evt) => {
      if (evt instanceof NavigationEnd) {
        router.navigated = false;
        window.scrollTo(0, 0);
      }
    }});
  }

  ngOnInit() {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [OperationType.pagoDeServicios],
      types: [String.fromCharCode(AccountTypes.passive)],
      currencies: ['BOL']
    });

    this.paymentInformation.operationTypeId = OperationType.pagoDeServicios;
    this.paymentInformation.operationTypeName = this.constants.afpService;
    this.paymentInformation.currency = Constants.currencyBol;
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }
  handleSourceAccountChanged($event: AccountResult) {
    this.approversDto = new InputApprovers({
      operationTypeId: OperationType.pagoDeServicios,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      accountNumber: $event.formattedNumber
    });

    this.account = $event;
    this.paymentInformation.sourceAccountId = $event.id;
    this.paymentInformation.sourceAccount = $event.number;
  }

  handleApproversAndControllersChanged($event: ApproversAndControllers) {
    this.paymentInformation.approvers = $event.approvers;
    this.paymentInformation.controllers = $event.controllers;
    this.paymentInformation.cismartApprovers = $event.cismartApprovers;
  }
  handleEmailsChanged($event: EmailInputModel) {
    this.paymentInformation.sendVouchers = $event.emails;
  }
  handleDebtDetailChanged($event: any) {
    this.ResponseModelsAfp = new ResponseModelsAfpquery();
    this.ResponseModelsAfp.codeAnswer = $event.codeAnswer;
    this.ResponseModelsAfp.codeauthorization = $event.codeauthorization;
    this.ResponseModelsAfp.detailAnswer = $event.detailAnswer;

    if (this.ResponseModelsAfp.codeAnswer === '000') {

      this.ResponseModelsAfp.detail = new PaymentAFP();
      this.ResponseModelsAfp.detail.amountTotal = $event.detail.amountTotal;

      this.ResponseModelsAfp.detail.detailDpaymentAFP[0] = new DetailAFPDto();
      this.ResponseModelsAfp.detail.detailDpaymentAFP[0].expirationDate = $event.detail.payments[0].expirationDate;
      this.ResponseModelsAfp.detail.detailDpaymentAFP[0].accountNumberAFP = $event.detail.payments[0].accountNumberAFP;
      this.ResponseModelsAfp.detail.detailDpaymentAFP[0].amounts = $event.detail.payments[0].amounts;

      this.ResponseModelsAfp.detail.detailDpaymentAFP[1] = new DetailAFPDto();
      this.ResponseModelsAfp.detail.detailDpaymentAFP[1].expirationDate = $event.detail.payments[1].expirationDate;
      this.ResponseModelsAfp.detail.detailDpaymentAFP[1].accountNumberAFP = $event.detail.payments[1].accountNumberAFP;
      this.ResponseModelsAfp.detail.detailDpaymentAFP[1].amounts = $event.detail.payments[1].amounts;

      this.ResponseModelsAfp.detail.detailDpaymentAFP[2] = new DetailAFPDto();
      this.ResponseModelsAfp.detail.detailDpaymentAFP[2].expirationDate = $event.detail.payments[2].expirationDate;
      this.ResponseModelsAfp.detail.detailDpaymentAFP[2].accountNumberAFP = $event.detail.payments[2].accountNumberAFP;
      this.ResponseModelsAfp.detail.detailDpaymentAFP[2].amounts = $event.detail.payments[2].amounts;


      this.isVisible = true;
      this.Totalaccount = $event.detail.amountTotal;
      this.paymentInformation.amount = this.Totalaccount;
      this.paymentInformation.serviceInformation = $event.detail;
      this.paymentInformation.serviceInformation.periodAFP = $event.detail.payments[0].expirationDate;
      this.paymentInformation.serviceInformation.deatilAFPsDto = $event.detail.payments;
    } else {
      this.isVisible = false;
    }
  }
  handleTokenSubmit($event: TokenCredentials) {
    this.paymentInformation.tokenCode = $event.code;
    this.paymentInformation.tokenName = $event.name;
    this.isTokenFormDisabled = true;
    this.serviceAFP.SavePaymentAFP(this.paymentInformation)
      .subscribe({next: response => {
        this.processBatchNumber = response.processBatchId;
        this.isPaymentSuccessful = this.isDisabledForm = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.messageService.info('Operación fallida', 'Por favor vuelva a intentarlo mas tarde.');
        this.isTokenFormDisabled = false;
      }});

  }

  handleValidateUif() {
    this.isPreSave = this.showModalPreSave;
    this.paymentInformation.isPrePreparer = this.isPreSave ? true : false;
    if (!this.isVisible) {
      this.message = 'Debe seleccionar e ingresar datos.';
      this.isVisibleError = true;
    }
    if (!this.currencyAndAmountValidation && this.showFunds) {
      this.isValidFunds = true;
    }
    if (this.currencyAndAmountValidation && this.sourceAccountValidation && this.approversAndControllersValidation && this.approversLimitValidation) {
      if (this.utilsService.validateAmount(this.account.currency, this.account.availableBalance, Constants.currencyBol, this.Totalaccount)) {
        this.excedeedAmount = true;
      }
      if (!this.isVisibleError) {
        this.validationCismart();
      }
    }
  }

  handleValidate(currencyAndAmountValidation: boolean, sourceAccountValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, isBtnPresave: boolean) {
    this.isValidFunds = false;
    this.isVisibleError = false;
    this.showModalPreSave = isBtnPresave;
    this.currencyAndAmountValidation = currencyAndAmountValidation;
    this.sourceAccountValidation = sourceAccountValidation;
    this.approversAndControllersValidation = approversAndControllersValidation;
    this.approversLimitValidation = approversLimitValidation;
    this.showToken();
  }

  handleIsPreparer($event: any) {
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
    this.isPreSave = false;
  }

  onClose($event: any) {
    this.showMessageIsBlock = $event;
  }

  showToken() {
      for (let i = 0; i < 1; i++) {
        this.paymentInformation.uif[i] = new UifDto();
        this.paymentInformation.uif[i].isSuspiciusUif = false;
        this.paymentInformation.uif[i].trace = Constants.trace;
        this.paymentInformation.uif[i].numberQueryUIF = 0;
        this.paymentInformation.uif[i].cumulus = 0;
        this.paymentInformation.uif[i].causalTransaction = 'RECAU';
        this.paymentInformation.uif[i].typeTransaction = Constants.typeTransaction;
        this.paymentInformation.uif[i].sourceFunds = this.paymentInformation.fundSource;
        this.paymentInformation.uif[i].destinationFunds = this.paymentInformation.fundDestination;
        this.paymentInformation.uif[i].branchOffice = Constants.branchOffice;
      }
      this.handleValidateUif();
  }

  isShowFundsForm($event: any) {
    this.showFunds = $event;
  }

  validationCismart() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res && !this.paymentInformation.isPrePreparer) {
          this.isVisibleToken = true;
        }
      }});
  }
}
