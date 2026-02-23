import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { Roles } from '../../../Services/shared/enums/roles';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { TicketResult } from '../../../Services/tickets/models/ticket-result';
import { TicketsService } from '../../../Services/tickets/tickets.service';
import { TicketCommissionResult } from '../../../Services/tickets/models/ticket-commission-result';
import { TransfersAbroadService } from '../../../Services/transfers-abroad/transfer-abroad.service';
import { ParametersResult } from '../../../Services/transfers-abroad/models/parameters-result';
import { GlobalService } from '../../../Services/shared/global.service';
import { TicketDto } from '../../../Services/tickets/models/ticket-dto';
import { TicketCommissionDto } from '../../../Services/tickets/models/ticket-commission-dto';
import { TicketOtherCurrencyDto } from '../../../Services/transfers-abroad/models/ticket-other-currency-dto';
import { ConfigurationsParameter } from '../../../Services/transfers-abroad/models/configurations-parameter';
import { TicketValidationResult } from '../../../Services/tickets/models/ticket-validation-result';
import { TransferAbroadPreSaveDto } from '../../../Services/transfers-abroad/models/transfer-abroad-pre-save-dto';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { ProcessBatchResult } from '../../../Services/shared/models/process-batch-result';
import { TicketModel } from '../../../Services/shared/models/ticket-model';
import { DataService } from '../../../Services/shared/data.service';
import { UtilsService } from '../../../Services/shared/utils.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../Services/parameters/models/parameter-dto';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component';
import { TransferAbroadResult } from '../../../Services/transfers-abroad/models/transfer-abroad-result';
import { UifService } from '../../../Services/uif/uif.service';
import { TransferAbroadDto } from '../../../Services/transfers-abroad/models/transfer-abroad-dto';
import { UifcwDto } from '../../../Services/uif/models/uifcw-dto';
import { UifDto } from '../../../Services/shared/models/uif-dto';
import { CurrencyAmountAbroadComponent } from '../components/currency-amount-abroad/currency-amount-abroad.component';
import { ParameterResult } from '../../../Services/parameters/models/parameter-result';
import { TicketOtherCurrencyResult } from '../../../Services/transfers-abroad/models/ticket-other-currency-result';
import { forkJoin } from 'rxjs';

@Component({

  selector: 'app-transfer-abroad-step1',
  standalone: false,
  templateUrl: './transfer-abroad-step1.component.html',
  styleUrls: ['./transfer-abroad-step1.component.css'],
  providers: [TransfersAbroadService, TicketsService, UtilsService, ParametersService]
})
export class TransferAbroadStep1Component implements OnInit {
  showFunds = false;
  isDisabledForm: boolean;
  types: string[] = ['P'];
  sourceAccountRequest = new AccountDto();
  ticket: TicketResult = new TicketResult();
  ticketCommission: TicketCommissionResult = new TicketCommissionResult();
  ticketOtherCurrency: string;
  isRequiredTicketOtherCurrency!: boolean;
  approversRequest: InputApprovers = new InputApprovers();
  parameters: ParametersResult = new ParametersResult();
  configurationParameters: ConfigurationsParameter = new ConfigurationsParameter();
  amountLimitTicket!: number;
  ticketCommissionCharge!: string;
  currencyAccount!: string;
  maxAmountTransfer!: number;
  transferAbroadDto: TransferAbroadPreSaveDto = new TransferAbroadPreSaveDto();
  sourceAccount: AccountResult = new AccountResult();
  dataTicketOtherCurrencyResult: TicketOtherCurrencyResult = new TicketOtherCurrencyResult();
  OPERATION_TYPE_TRANSFER_SEMIAUTOMATIC = 0;
  OPERATION_TYPE_TRANSFER_AUTOMATIC = 1;
  excedeedAmount = false;
  firstValidate = true;
  transferAbroadTick : boolean =true;
  @Output() onChange = new EventEmitter<number>();
  @Output() onChangeFunds = new EventEmitter<TransferAbroadDto>();
  @Output() onChangeNamesApprovers = new EventEmitter<any[]>();
  @ViewChild(ApproversAndControllersComponent)
  approversComponent!: ApproversAndControllersComponent;
  @ViewChild(CurrencyAmountAbroadComponent)
  currencyUif!: CurrencyAmountAbroadComponent;
  resultFunds: TransferAbroadResult = new TransferAbroadResult();
  showMessage = true;
  showMessageIsBlock = false;
  transferSave: TransferAbroadDto = new TransferAbroadDto();
  uifDates: UifcwDto = new UifcwDto();

  isValidFormSourceAccount!: boolean;
  isValidFormTicket!: boolean;
  isValidFormCurrencyAmount!: boolean;
  isValidFormTicketCommission!: boolean;
  isValidFormTicketOtherCurrency!: boolean;
  isValidApproversAndControllers!: boolean;
  isValidApproversAndControllersLimits!: boolean;
  isValidEmailInput!: boolean;
  isExteriorTransfer = true;
  parameterDto: ParameterDto = new ParameterDto();
  parameterResult: ParameterResult = new ParameterResult();
  isValidateCurreny = false;

  constructor(private transfersAbroadService: TransfersAbroadService,
    private uifService: UifService,
    private globalService: GlobalService,
    private ticketsService: TicketsService,
    private dataService: DataService,
    private utilsService: UtilsService,
    private parametersService: ParametersService) {
    this.isDisabledForm = false;
    this.ticketOtherCurrency = '';
  }

  ngOnInit() {
      this.sourceAccountRequest = new AccountDto({
        accountUse: String.fromCharCode(AccountUse.debit),
        operationTypeId: [OperationType.transAlExteriorConCambioD],
        roleId: Roles.initiator,
        types: this.types
      });
    this.parameterDto.group = 'TRAEXT';
    this.parameterDto.code = 'HORA';
    this.parametersService.getByGroupAndCode(this.parameterDto)
    .subscribe({next: (response) => {
      this.parameterResult = response;
    }, error: _err => {
      this.globalService.danger('Servicio de Parametros', _err.message);
    }})
    this.getParameters();
  }

  handleSourceAccountChanged($event: AccountResult) {
    this.transferAbroadDto.sourceAccountId = $event.id;
    this.transferAbroadDto.sourceAccount = $event.number;
    this.transferAbroadDto.sourceCurrency = $event.currency;
    this.sourceAccount = $event;
    this.currencyAccount = $event.currency;
    this.approversRequest = new InputApprovers({
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: $event.id,
      operationTypeId: OperationType.transAlExteriorConCambioD,
      accountNumber: $event.formattedNumber
    });
  }

  handleGetTicket($event: TicketModel) {
    this.ticket = $event.ticket;
  }

  getParameters() {
    this.transfersAbroadService.getParameters()
      .subscribe({next: (response: ParametersResult) => {
        this.parameters = response;
      }, error: _err => {
        this.globalService.danger('Servicio de Parametros', _err.message);
      }});
    this.transfersAbroadService.getConfigurationParameters()
      .subscribe({next: (response: ConfigurationsParameter) => {
        this.configurationParameters = response;
        this.maxAmountTransfer = response.maxAmountTransfer;
      }, error: _err => {
        this.globalService.danger('Servicio de Parametros de Configuración', _err.message);
      }});
  }

  getTicketCommission($event: TicketCommissionResult) {
    this.ticketCommission = $event;
  }

  handleChangeTicketOtherCurrency($event: string) {
    this.ticketOtherCurrency = $event;
  }

  handleCurrencyDestinationIsDollar($event: any) {
    if ($event) {
      this.isRequiredTicketOtherCurrency = false;
    } else {
      this.isRequiredTicketOtherCurrency = true;
    }
  }

  handleChangeCharge($event: string) {
    this.ticketCommissionCharge = $event;
  }

  handleOpenForm() {
    this.approversComponent.validationCismart()
      .subscribe({next: (res) => {
        if (res) {
          const isExcededd = this.utilsService.validateAmount(this.sourceAccount.currency, +this.sourceAccount.availableBalance, this.transferAbroadDto.currency, +this.transferAbroadDto.amount)!;
          if (isExcededd) {
            if (this.firstValidate) {
              this.excedeedAmount = true;
              this.firstValidate = false;
              return false;
            }
          }

          let validForSend = true;
          const { configurationParameters, ticket } = this;

          if (this.transferAbroadDto.amount > configurationParameters.maxAmountTransfer && !this.transferAbroadDto.isTicket && this.sourceAccount.currency !== this.transferAbroadDto.currency) {
            this.globalService.warning('Comunicado Ticket de cambio preferencial Boliviano - Dólar',
              `Para montos mayores o iguales a ${configurationParameters.maxAmountTransfer} USD, seleccione la casilla tipo de cambio preferencial Boliviano-Dólar y haga clic en el boton Obtener Ticket.Línea gratuita 800-10-9995`, true);
            validForSend = false;
          } else if (this.transferAbroadDto.amount < configurationParameters.minAmountTransfer) {
            this.globalService.warning('Comunicado Monto Transferencia',
              `Solo se puede realizar transferencias al exterior por un Monto a Transferir mayor o igual a ${configurationParameters.minAmountTransfer} dolares`);
            validForSend = false;
          }

          if (validForSend) {
            this.validateTicketsAndSave(+this.transferAbroadDto.amount,
              this.transferAbroadDto.destinationCurrency,
              +this.transferAbroadDto.destinationAmount);
          }

        }
        return;
      }});
  }

  validateTicketsAndSave(amount: number, destinationCurrency: string, amountDestination: number) {
    let isValid = true;
    const { ticket, ticketCommission, ticketCommissionCharge, currencyAccount, ticketOtherCurrency, transferAbroadDto } = this;
    const sourceCurrency = currencyAccount;
    ticket.ticket = transferAbroadDto.numberTicket!;
    ticket.originalAmount = transferAbroadDto.amount;
    const ticketDto = new TicketDto({
      amount: ticket.originalAmount,
      sourceCurrency: sourceCurrency,
      destinationCurrency: destinationCurrency,
      number: ticket.ticket,
      isExteriorTransfer: this.isExteriorTransfer
    });

    const ticketCommissionDto = new TicketCommissionDto({
      amount: ticketCommission.originalAmount,
      commissionCharge: ticketCommissionCharge,
      ticket: ticketCommission.ticket,
    });

    const observables = [];
    if (ticket.ticket > 0) {
      observables.push(this.ticketsService.verifyGMESATicket(ticketDto));
    }

    if (ticketCommission.ticket !== '') {
      observables.push(this.ticketsService.verifySGMDDTicket(ticketCommissionDto));
    }

    if (ticketOtherCurrency !== '') {
      observables.push(this.transfersAbroadService.getTicketOtherCurrency(new TicketOtherCurrencyDto({ ticket: ticketOtherCurrency })));
    }

    const combined = forkJoin(observables);
    combined.subscribe({next: (res: any[]) => {
      let numberResult = 0;
      if (ticket.ticket > 0) {
        isValid = isValid && this.isValidTicket(res[numberResult]);
        ticket.exchangeRate = res[numberResult].exchangeRate;
        ticket.operationType = res[numberResult].operationType;
        numberResult++;
      }

      if (ticketCommission.ticket !== '') {
        isValid = isValid && this.isValidTicketCommission(res[numberResult], amount);
        numberResult++;
      }

      if (ticketOtherCurrency !== '') {
        isValid = isValid && this.isValidTicketOtherCurrency(res[numberResult],
          amount,
          amountDestination,
          destinationCurrency);
        numberResult++;
      }

      if (isValid) {
        this.saveTransfer();
      }
    }, error: _err => {
      this.globalService.danger('Error', _err.message);
    }});

    if (observables.length === 0) {
      this.saveTransfer();
    }
  }

  isValidTicket(dataTicket: TicketValidationResult): boolean {
    if (dataTicket.isValid) {
      return true;
    }
    this.globalService.danger('Advertencia', dataTicket.errorMessage, true);
    return false;
  }

  isValidTicketCommission(dataTicketCommission: TicketCommissionResult, currentAmount: number): boolean {
    const { ticketCommission } = this;
    const correctstate = 'P';
    if (dataTicketCommission.state === correctstate && dataTicketCommission.responseCode === 0) {
      if (dataTicketCommission.originalAmount !== currentAmount) {
        this.globalService.warning('Advertencia',
          `El Monto a transferir del ticket ${dataTicketCommission.ticket} no corresponde al monto introducido`, true);
        return false;
      } else {
        ticketCommission.ticket = dataTicketCommission.ticket;
        ticketCommission.entry = dataTicketCommission.entry;
        ticketCommission.ourCommission = dataTicketCommission.ourCommission;
        ticketCommission.sendingType = dataTicketCommission.sendingType;
        ticketCommission.originalAmount = dataTicketCommission.originalAmount;
        ticketCommission.porteCommission = dataTicketCommission.porteCommission;
        ticketCommission.state = dataTicketCommission.state;
        ticketCommission.othersCommission = dataTicketCommission.othersCommission;
        return true;
      }
    } else {
      this.globalService.danger('Advertencia', 'En la validación del ticket de comisión');
      return false;
    }
  }

  isValidTicketOtherCurrency(dataTicketOtherCurrency: TicketOtherCurrencyResult,
    amount: number,
    amountDestination: number,
    destinationCurrency: string): boolean {
    this.dataTicketOtherCurrencyResult = dataTicketOtherCurrency;

    let isValid = true;
    if (dataTicketOtherCurrency.equivalentDollar !== amount) {
      this.globalService.warning('Advertencia'
        , `El Monto a transferir del ticket ${this.ticketOtherCurrency} no corresponde al monto introducido`, true);
      isValid = false;
    }

    if (dataTicketOtherCurrency.currency !== destinationCurrency) {
      this.globalService.warning('Advertencia'
        , `La moneda destino del ticket  ${this.ticketOtherCurrency} no corresponde a la moneda seleccionada`, true);
      isValid = false;
    }

    if (dataTicketOtherCurrency.amount !== amountDestination) {
      this.globalService.warning('Advertencia'
        , `El importe destino del ticket ${this.ticketOtherCurrency} no corresponde al monto introducido`, true);
      isValid = false;
    }
    return isValid;
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.transferAbroadDto.controllers = $event.controllers;
    this.transferAbroadDto.approvers = $event.approvers;
    this.transferAbroadDto.cismartApprovers = $event.cismartApprovers;
  }

  validateForms(isValidFormSourceAccount: boolean, isValidFormTicket: boolean, isValidFormCurrencyAmount: boolean, isValidFormTicketCommission: boolean,
    isValidFormTicketOtherCurrency: boolean, isValidApproversAndControllers: boolean, isValidApproversAndControllersLimits: boolean, isValidEmailInput: boolean) {
      if (this.ticketCommissionCharge == undefined || this.ticketCommissionCharge == 'default'){
        this.globalService.warning('Información. ', 'Para poder continuar con la operación debe ingresar el número de ticket de la comisión.');
          return;
      }
      this.isValidFormSourceAccount = isValidFormSourceAccount;
      this.isValidFormTicket = isValidFormTicket;
      this.isValidFormCurrencyAmount = isValidFormCurrencyAmount;
      this.isValidFormTicketCommission = isValidFormTicketCommission;
      this.isValidFormTicketOtherCurrency = isValidFormTicketOtherCurrency;
      this.isValidApproversAndControllers = isValidApproversAndControllers;
      this.isValidApproversAndControllersLimits = isValidApproversAndControllersLimits;
      this.isValidEmailInput = isValidEmailInput;
      this.handleShowToken();
  }

  handleReturnValidate() {
    return this.isValidFormSourceAccount && this.isValidFormTicket && this.isValidFormCurrencyAmount && this.isValidFormTicketCommission && this.isValidFormTicketOtherCurrency
      && this.isValidApproversAndControllers && this.isValidApproversAndControllersLimits && this.isValidEmailInput;
  }

  handleLoadDates() {
    this.uifDates.accountNumber = this.transferAbroadDto.sourceAccount;
    this.uifDates.amount = this.transferAbroadDto.amount;
    this.uifDates.currency = this.transferAbroadDto.currency;
    this.uifDates.causalTransaction = 'TREXT';
    this.uifDates.typeTransaction = 'LAVA';
  }

  handleShowToken() {
    this.handleLoadDates();
      for (let i = 0; i < 1; i++) {
        this.transferSave.uif[i] = new UifDto();
        this.transferSave.uif[i].isSuspiciusUif = false;
        this.transferSave.uif[i].trace = 'SIN TRACE';
        this.transferSave.uif[i].numberQueryUIF = 0;
        this.transferSave.uif[i].cumulus = 0;
        this.transferSave.uif[i].causalTransaction = this.uifDates.causalTransaction;
        this.transferSave.uif[i].typeTransaction = this.uifDates.typeTransaction;
        this.transferSave.uif[i].branchOffice = '201204';
        this.transferSave.uif[i].sourceFunds = this.transferAbroadDto.fundSource;
        this.transferSave.uif[i].destinationFunds = this.transferAbroadDto.fundDestination;
      }
      if (!this.transferSave.isValidUif || this.currencyUif.handleValidate()) {
        return this.handleReturnValidate() && this.handleOpenForm();
      }
  }

  saveTransfer() {
    const { transferAbroadDto, ticket, ticketCommission, dataTicketOtherCurrencyResult, ticketOtherCurrency } = this;
    transferAbroadDto.isTicket = ticket.ticket > 0;
    transferAbroadDto.numberTicket = ticket.ticket;
    transferAbroadDto.preferentialExchange = ticket.exchangeRate;
    transferAbroadDto.indicatorBuyOrSale = ticket.operationType;
    transferAbroadDto.isTicketCommission = ticketCommission.ticket !== '';
    transferAbroadDto.numberTicketCommission = ticketCommission.ticket;
    transferAbroadDto.commissionAmount = ticketCommission.entry;
    transferAbroadDto.amountTicketCommissionOur = ticketCommission.ourCommission;
    transferAbroadDto.detailCharges = ticketCommission.sendingType;
    transferAbroadDto.isTicketOtherCurrency = ticketOtherCurrency !== '';
    transferAbroadDto.numberTicketOtherCurrency = dataTicketOtherCurrencyResult.ticket;
    transferAbroadDto.typeTicketOtherCurrency = dataTicketOtherCurrencyResult.currency;
    transferAbroadDto.amountTicketOtherCurrency = dataTicketOtherCurrencyResult.amount;
    transferAbroadDto.exchangeRateOperationTicketOtherCurrency = dataTicketOtherCurrencyResult.exchangeRate;
    transferAbroadDto.amountInDollarsTicketOtherCurrency = dataTicketOtherCurrencyResult.equivalentDollar;
    transferAbroadDto.cicTicketOtherCurrency = dataTicketOtherCurrencyResult.cic;
    transferAbroadDto.transferOperationType = dataTicketOtherCurrencyResult.ticket !== undefined && dataTicketOtherCurrencyResult.ticket !== '' ? this.OPERATION_TYPE_TRANSFER_SEMIAUTOMATIC : this.OPERATION_TYPE_TRANSFER_AUTOMATIC;
    transferAbroadDto.ticketCommissionImporte = ticketCommission.originalAmount;
    transferAbroadDto.ticketCommissionPorte = ticketCommission.porteCommission;
    transferAbroadDto.tickectCommissionState = ticketCommission.state;
    transferAbroadDto.ticketCommissionOthers = ticketCommission.othersCommission;

    this.transferSave.fundSource = transferAbroadDto.fundSource;
    this.transferSave.fundDestination = transferAbroadDto.fundDestination;
    this.resultFunds.isShowFunds = this.showFunds;

    this.transfersAbroadService
      .preSaveTransfer(transferAbroadDto)
      .subscribe({next: (res: ProcessBatchResult) => {
        this.dataService.serviceData = res.processBatchId;
        this.transferSave.isValidUif = this.showFunds;
        this.onChange.emit(res.processBatchId);
        this.onChangeFunds.emit(this.transferSave);
      }, error: _err => {
        this.globalService.danger('Servicio de transferencia al exterior', _err.message);
      }});
  }

  handleShowFundsForm($event: any) {
    this.showFunds = $event;
  }

  handleNamesApprovers($event: any[]) {
    this.onChangeNamesApprovers.emit($event);
  }

  onClose($event: any) {
    this.showMessageIsBlock = $event;
  }
}
