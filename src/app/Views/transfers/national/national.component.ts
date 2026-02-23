import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { ProcessBatchResult } from '../../../Services/historical-accounts/models/process-batch-result';
import { AccountInformation } from '../../../Services/mass-payments/Models/payment-ach/account-information';
import { PaymentAchData } from '../../../Services/mass-payments/Models/payment-ach/payment-ach-data';
import { PaymentAchSpreadsheetResult } from '../../../Services/mass-payments/Models/payment-ach/payment-ach-spreadsheet-result';
import { PaymentAchService } from '../../../Services/mass-payments/payment-ach.service';
import { ParameterResult } from '../../../Services/parameters/models/parameter-result';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Constants } from '../../../Services/shared/enums/constants';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { GlobalService } from '../../../Services/shared/global.service';
import { DateFutureModel } from '../../../Services/shared/models/date-future-model';
import { SaveFavorite } from '../../../Services/shared/models/save-favorite';
import { UtilsService } from '../../../Services/shared/utils.service';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { TransfersService } from '../../../Services/transfers/transfers.service';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { SourceAccountsComponent } from '../../shared/cw-components/source-accounts/source-accounts.component';
import { FavoriteTransfersComponent } from '../components/favorite-transfers/favorite-transfers.component';
import { InterbankAccountsComponent } from '../components/interbank-accounts/interbank-accounts.component';
import { SearchAccountsComponent } from '../components/search-accounts/search-accounts.component';
import { TransferData } from './../../../Services/transfers/models/transfer-data';
import { AccountOwnerResult } from '../../../Services/accounts/models/account-owner-result';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { TransferTypes } from '../../../Services/shared/enums/transfer-types';
import { NgForm } from '@angular/forms';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { VoucherDto } from '../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { CurrencyAndAmountComponent } from '../../shared/cw-components/currency-and-amount/currency-and-amount.component';
import { UserService } from '../../../Services/users/user.service';
import { ParameterDto } from '../../../Services/parameters/models/parameter-dto';
import { CashOnline } from '../../../Services/accounts/models/CashOnline';
import { IpAddresService } from '../../../Services/users/ip-addres.service';
import { catchError } from 'rxjs';
import { DBFDMonitorService } from '../../../Services/DBFDMonitor/dbfdmonitor.service';
@Component({
  selector: 'app-national',
  standalone: false,
  templateUrl: './national.component.html',
  styleUrls: ['./national.component.css'],
  providers: [TransfersService, UtilsService, TicketsService, PaymentAchService]
})

export class NationalComponent implements OnInit {

  showFunds = false;
  showMessageIsBlock = false;
  transferType = '';
  successfulTransferMessage: string;
  isTransferSuccessful = false;
  isTokenFormDisabled = false;
  isVisibleToken = false;
  excedeedAmount = false;
  isDisabledForm = false;
  isOwnerHasError = false;
  processBatchNumber = 0;
  scheduleOperation = false;
  isAmountDisabled = false;
  groupIndex: number = 0;
  branchOffices: ParameterResult[] = [];
  banks!: ParameterResult[];
  transferDto: PaymentAchData = new PaymentAchData();
  interbankAccountInformation: AccountInformation = new AccountInformation();
  sourceAccount: AccountResult = new AccountResult();
  approversDto: InputApprovers = new InputApprovers();
  batchInformation: TransferData = new TransferData();
  sourceAccountDto: AccountDto = new AccountDto();
  targetAccountDto: AccountDto = new AccountDto();
  targetAccountUSD: AccountDto = new AccountDto();
  targetAccountBOL: AccountDto = new AccountDto();
  messageMonitor: string = '';
  currencies: ParameterResult[] = [];
  currenciesAll: ParameterResult[] = [];
  @ViewChild('targetAccount') sourceAccountComponent!: SourceAccountsComponent;
  @ViewChild(FavoriteTransfersComponent) favoriteComponent!: FavoriteTransfersComponent;
  @ViewChild(forwardRef(() => InterbankAccountsComponent)) interbankAccountComponent!: InterbankAccountsComponent;
  @ViewChild(SearchAccountsComponent) searchAccountsComponent!: SearchAccountsComponent;
  @ViewChild(ApproversAndControllersComponent)
  approversComponent!: ApproversAndControllersComponent;
  @ViewChild('fundsForm') fundsForm!: NgForm;
  @ViewChild(CurrencyAndAmountComponent) currencyUif!: CurrencyAndAmountComponent;
  requestDto: VoucherDto = new VoucherDto();
  is_validbatchtoken!: boolean;
  isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;

  currencyAndAmountValidation!: boolean;
  approversAndControllersValidation!: boolean;
  approversLimitValidation!: boolean;
  emailValidation!: boolean;
  sourceAccountValidation!: boolean;
  showModalPreSave = false;
  showModalSetDate = false;
  onlyCurrencyBOL = false;
  isValidateCurreny = false;
  isValidateDest = false;
  isValidTRTER = false;
  isCashOnlineNew: CashOnline = new CashOnline();

  constructor(private ipEnc: IpAddresService, private messageService: GlobalService, private parametersService: ParametersService,
    private transfersService: TransfersService, private ticketsService: TicketsService,
    private utilsService: UtilsService, private achService: PaymentAchService, private userService: UserService, private monitor: DBFDMonitorService) {
    this.successfulTransferMessage = Constants.successfulTransactionMessage;
  }

  ngOnInit() {
    this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'RESUSD', code: 'USD' }))

      .subscribe({
        next: resp => {
          this.isValidateCurreny = resp.value == 'A' ? true : false;
        }
      });
    this.parametersService.getByGroupAndCode(new ParameterDto({ group: 'TICKET', code: 'MDD' }))
      .subscribe({ next: response => this.isValidateDest = response.value == 'A' });
    this.parametersService.getByGroup(new ParameterDto({ group: 'MONEFE' }))
      .subscribe({
        next: resp => {
          this.currencies = this.currenciesAll = resp;
        }
      });

    this.userService.getValidateCurrentUser();
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    this.batchInformation.isAch = false;
    this.sourceAccountDto = new AccountDto({
      operationTypeId: [OperationType.nationalTransfers],
      types: [String.fromCharCode(AccountTypes.passive)],
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator
    });
    this.targetAccountDto = this.targetAccountUSD = this.targetAccountBOL = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      types: [String.fromCharCode(AccountTypes.passive)]
    });
    this.batchInformation.operationTypeId = OperationType.nationalTransfers;
    this.branchOffices = this.utilsService.getBranchOffices();
    this.getIpAddres();
  }
  async getIpAddres() {
    try {
      const ip = await this.ipEnc.getClientIp();
      this.batchInformation.ip  = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.batchInformation.ip = 'NOT_IP';
    }
    /* this.ipEnc.getIpClient().pipe(
      catchError(error => this.ipEnc.getIpAddress())
    ).subscribe({
      next: response => {
        this.batchInformation.ip = response.ip;
      }, error: _err => {
        this.batchInformation.ip = 'NOT_IP';
      }
    }); */

  }

  handleGetBanks() {
    this.achService.getBanks().subscribe({
      next: response => this.banks = response,
      error: _err => this.messageService.info('Parámetros', _err.message)
    });
  }

  handleGroupChanged(groupIndex: number) {
    this.groupIndex = groupIndex;
    switch (groupIndex) {
      case 0: this.sourceAccountComponent?.restart();
        this.batchInformation.type = TransferTypes.own;
        this.batchInformation.isAch = false;
        this.transferType = 'TRPRO'; break;
      case 1: this.favoriteComponent?.restart();

        this.batchInformation.type = TransferTypes.thirdParty;
        this.batchInformation.isAch = false;
        this.transferType = 'TRTER';
        this.favoriteComponent?.handleGetFavorite();
        break;
      case 2: this.searchAccountsComponent?.restart();
        this.batchInformation.isAch = false;
        this.batchInformation.type = TransferTypes.thirdParty;
        this.transferType = 'TRTER'; break;
      case 3: this.interbankAccountInformation = new AccountInformation();

        this.batchInformation.type = TransferTypes.interbank;
        this.batchInformation.isAch = true;
        this.transferType = 'TRACH';
        this.handleGetBanks();
        break;
    }
  }

  validateAccounts(): boolean {
    if (this.groupIndex === 0 && this.sourceAccount.formattedNumber === this.batchInformation.destinationAccount) {
      this.messageService.warning('Cuentas incorrectas', 'Las cuentas de origen y destino deben ser diferentes', true);
      return false;
    }
    return true;
  }

  handleSourceAccountChanged($event: AccountResult) {
    this.currencies = this.currenciesAll;
    this.approversDto = new InputApprovers({
      accountId: $event.id,
      operationTypeId: OperationType.nationalTransfers,
      isAuthorizerControl: $event.isAuthorizerControl,
      accountNumber: $event.formattedNumber
    });
    this.batchInformation.sourceAccount = $event.number;
    this.batchInformation.sourceAccountId = $event.id;
    this.batchInformation.sourceCurrency = $event.currency;
    this.sourceAccount = $event;
    this.handleChangeSourceCurrency();
  }

  handleChangeSourceCurrency() {
    if (this.isValidateCurreny && this.batchInformation.sourceCurrency != undefined) {
      this.batchInformation.currency = this.batchInformation.sourceCurrency
      if (this.batchInformation.currency === 'BOL') {
        this.currencies = this.currenciesAll.filter(x => x.code == 'BOL');
      } else if (this.batchInformation.currency === 'USD') {
        this.currencies = this.currenciesAll.filter(x => x.code == 'USD');
      } else {
        this.batchInformation.currency = '';
        this.currencies = this.currenciesAll;
      }
    }
  }


  handleDestinationAccountChanged($event: AccountOwnerResult) {
    if (!(this.isOwnerHasError = $event.isOwnerHasError) && $event.currency) {
      this.batchInformation.targetAccountCurrency = $event.currency;
      this.batchInformation.destinationAccount = $event.formattedNumber;
    }
    this.batchInformation.beneficiary = $event.owner;
  }

  handleDateFuture($event: DateFutureModel) {
    this.batchInformation.isScheduledProcess = $event.isDateFuture;
    this.batchInformation.scheduledProcess = $event.date;
    this.batchInformation.scheduledProcessString = $event.dateString;
    if ($event.isDateFuture) {
      this.validateAmounts();
    }
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.batchInformation.controllers = $event.controllers;
    this.batchInformation.approvers = $event.approvers;
    this.batchInformation.cismartApprovers = $event.cismartApprovers;
  }

  handleTokenSubmit($event: TokenCredentials) {
    if (!this.batchInformation.isPrePreparer) {
      this.batchInformation.tokenCode = $event.code;
      this.batchInformation.tokenName = $event.name;
    }
    this.saveTransfer();
  }

  handleValidate(currencyAndAmountValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, emailValidation: boolean, sourceAccountValidation: boolean, isBtnPresave: boolean) {
    if (this.groupIndex == 0 || this.groupIndex == 2) {
      if (this.isValidateDest || this.isValidateCurreny) {
        this.batchInformation.destinationAccount = this.batchInformation.destinationAccount.replaceAll('-', '');
        if (!this.batchInformation.destinationAccount.includes('-')) {
          let acc = this.batchInformation.destinationAccount.substring(this.batchInformation.destinationAccount.length - 3);
          let newAcc = acc.charAt(0);
          let newCurrency = newAcc == '3' ? 'BOL' : 'USD';
          if (this.batchInformation.currency == 'BOL' && this.batchInformation.sourceCurrency == 'BOL' && newCurrency == 'USD') {
            this.messageService.warning("Información", "Por favor debe seleccionar una cuenta destino en BOLIVIANOS.");
            return;
          }
        }
      }
    }
    this.currencyAndAmountValidation = currencyAndAmountValidation;
    this.approversAndControllersValidation = approversAndControllersValidation;
    this.approversLimitValidation = approversLimitValidation;
    this.emailValidation = emailValidation;
    this.sourceAccountValidation = sourceAccountValidation;
    this.showModalPreSave = isBtnPresave;
    this.validMonitor();
    this.showToken();
  }
  validMonitor(){
    this.parametersService.getByGroup({group: 'MONITR', code: 'MONITR'})
    .subscribe({next: resp => {
      resp.forEach(e => {
        if(e.value.toString()==='A'){
          this.superviceMonitor();
        }
      });
    }})
  }
  superviceMonitor() {
    if (this.groupIndex === 3 || this.batchInformation.isAch) {
      this.transferDto = Object.assign(this.transferDto, this.batchInformation);
      this.transferDto.type = 2;
      this.transferDto.spreadsheet = [];
      this.transferDto.spreadsheet.push(new PaymentAchSpreadsheetResult({
        line: 1,
        targetAccount: this.interbankAccountInformation.number,
        beneficiary: this.interbankAccountInformation.beneficiary,
        branchOfficeId: +this.interbankAccountInformation.branchOffice,
        branchOfficeDescription: this.interbankAccountInformation.branchOfficeDescription,
        bankDescription: this.interbankAccountInformation.bankDescription,
        banksAchCode: this.interbankAccountInformation.bank,
        amount: this.batchInformation.amount,
        processMessage: this.messageMonitor
      }));

      this.monitor.superviceMonitor(this.transferDto)
        .subscribe({
          next: (resp: PaymentAchSpreadsheetResult[]) => {
            resp.forEach(element => {
              if (element.operationStatusId != 0) {
                this.batchInformation.operationStatusId = 14
                this.messageMonitor=element.processMessage
              }
            });
            this.transferDto.spreadsheet = resp;
          }
        })
    }
  }
  handleValidateUif() {
    if (this.currencyAndAmountValidation && this.approversAndControllersValidation && this.validateAccounts() && this.approversLimitValidation && this.emailValidation && this.sourceAccountValidation && this.validateDestinationAccount() && (this.batchInformation.isAch || !this.isOwnerHasError)) {
      this.isPreSave = this.showModalPreSave;
      this.batchInformation.isPrePreparer = this.isPreSave ? true : false;
      if (!this.batchInformation.isTicket) {
        this.validateAmounts();
      } else {
        this.validateGMESATicket();
      }
    }
  }

  handleIsPreparer($event: any) {
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
    this.isPreSave = false;
  }

  handleValidateSetDate() {
    if (this.currencyAndAmountValidation && this.approversAndControllersValidation && this.validateAccounts() && this.approversLimitValidation && this.emailValidation && this.sourceAccountValidation && this.validateDestinationAccount() && (this.batchInformation.isAch || !this.isOwnerHasError)) {
      this.scheduleOperation = true;
    }
    this.showModalSetDate = false;
  }

  handleValidateForScheduleOperation(currencyAndAmountValidation: boolean, approversAndControllersValidation: boolean, approversLimitValidation: boolean, emailValidation: boolean, sourceAccountValidation: boolean, isSetDate: boolean) {
    this.currencyAndAmountValidation = currencyAndAmountValidation;
    this.approversAndControllersValidation = approversAndControllersValidation;
    this.approversLimitValidation = approversLimitValidation;
    this.emailValidation = emailValidation;
    this.sourceAccountValidation = sourceAccountValidation;
    this.showModalSetDate = isSetDate;
    this.validMonitor();
    this.showToken();
  }

  saveTransfer() {
    this.isTokenFormDisabled = true;
    if (this.groupIndex === 3 || this.batchInformation.isAch) {
      this.transferDto = Object.assign(this.transferDto, this.batchInformation);
      this.transferDto.type = 2;
      this.transferDto.spreadsheet = [];
      this.transferDto.spreadsheet.push(new PaymentAchSpreadsheetResult({
        line: 1,
        targetAccount: this.interbankAccountInformation.number,
        beneficiary: this.interbankAccountInformation.beneficiary,
        branchOfficeId: +this.interbankAccountInformation.branchOffice,
        branchOfficeDescription: this.interbankAccountInformation.branchOfficeDescription,
        bankDescription: this.interbankAccountInformation.bankDescription,
        banksAchCode: this.interbankAccountInformation.bank,
        amount: this.batchInformation.amount,
        processMessage: this.messageMonitor
      }));
      if (!this.utilsService.validateProdem(this.transferDto.currency, this.transferDto.spreadsheet)) {
        this.achService.save(this.transferDto).subscribe({
          next: response =>
            this.showTransferSuccessful(response),
          error: _err => this.showTransferError(_err)
        });
      } else {
        this.messageService.info('Validación de pagos', 'La transferencia no puede ser guardada, por el momento PRODEM no acepta pagos en DÓLARES');
      }
    } else {
      this.transfersService.save(this.batchInformation).subscribe({
        next: response =>
          this.showTransferSuccessful(response),
        error: _err => this.showTransferError(_err)
      });
    }
  }

  showTransferError(_err: any) {
    this.messageService.danger('', _err.message);
    this.isTokenFormDisabled = false;
  }

  showTransferSuccessful(response: ProcessBatchResult) {
    this.processBatchNumber = response.processBatchId;
    this.isDisabledForm = this.isTransferSuccessful = true;
    this.isAmountDisabled = true;
    this.isVisibleToken = this.isTokenFormDisabled = false;
  }

  validateAmounts() {
    if (this.utilsService.validateAmount(this.sourceAccount.currency, +this.sourceAccount.availableBalance, this.batchInformation.currency, +this.batchInformation.amount)) {
      this.excedeedAmount = true;
    } else {
      this.validationCismart();
    }
  }

  validateDestinationAccount(): boolean | any {
    switch (this.groupIndex) {
      case 0: return this.sourceAccountComponent.handleValidate()!;
      case 1: return this.favoriteComponent.handleValidate()!;
      case 2: return this.searchAccountsComponent.handleValidate()!;
      case 3: return this.interbankAccountComponent.handleValidate()!;
    }
  }

  handleSaveFavoriteChanged($event: SaveFavorite) {
    this.batchInformation.isFavorite = $event.isFavorite;
    this.batchInformation.favoriteName = $event.name;
  }

  validateGMESATicket() {
    this.ticketsService.verifyGMESATicket(new TicketDto({
      destinationCurrency: this.batchInformation.currency, sourceCurrency: this.sourceAccount.currency,
      number: this.batchInformation.numberTicket, amount: this.batchInformation.amount
    })).subscribe({
      next: resp => {
        if (resp.isValid) {
          this.batchInformation.preferentialExchange = resp.exchangeRate;
          this.batchInformation.indicatorBuyOrSale = resp.operationType;
          this.validateAmounts();
        } else {
          this.messageService.warning('Ticket preferencial incorrecto', resp.errorMessage, true);
        }
      }, error: _err => this.messageService.warning('Servicio Mesa de Dinero', _err.message)
    });
  }

  showToken() {
    this.getIpAddres();
    for (let i = 0; i < 1; i++) {
      this.batchInformation.uif[i] = new UifDto();
      this.batchInformation.uif[i].isSuspiciusUif = false;
      this.batchInformation.uif[i].trace = 'SIN TRACE';
      this.batchInformation.uif[i].numberQueryUIF = 0;
      this.batchInformation.uif[i].cumulus = 0;
      this.batchInformation.uif[i].causalTransaction = this.transferType;
      this.batchInformation.uif[i].typeTransaction = 'LAVA';
      this.batchInformation.uif[i].sourceFunds = this.batchInformation.fundSource;
      this.batchInformation.uif[i].destinationFunds = this.batchInformation.fundDestination;
      this.batchInformation.uif[i].branchOffice = '201204';
    }
    if (!this.batchInformation.isValidUif || this.currencyUif.handleValidate()) {
      if (this.showModalSetDate) {
        this.handleValidateSetDate();
      } else {
        this.handleValidateUif();
      }
    }
  }

  isShowFundsForm($event: any) {
    this.showFunds = $event;
  }

  onClose($event: any) {
    this.showMessageIsBlock = $event;
  }

  validationCismart() {
    this.approversComponent.validationCismart()
      .subscribe({
        next: res => {
          if (res && !this.batchInformation.isPrePreparer) {
            this.isVisibleToken = true;
          }
        }
      });
  }
}
