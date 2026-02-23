import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TransfersAbroadService } from '../../../Services/transfers-abroad/transfer-abroad.service';
import { GetTransferAbroadDto } from '../../../Services/transfers-abroad/models/get-transfer-abroad-dto';
import { TransferAbroadResult } from '../../../Services/transfers-abroad/models/transfer-abroad-result';
import { GlobalService } from '../../../Services/shared/global.service';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { ApproversAndControllers } from '../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { TransferAbroadDto } from '../../../Services/transfers-abroad/models/transfer-abroad-dto';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { Constants } from '../../../Services/shared/enums/constants';
import { EmailInputModel } from '../../../Services/shared/models/email-input-model';
import { DataService } from '../../../Services/shared/data.service';
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers';
import { DepecratedSourceAccountsComponent } from '../../shared/components/depecrated-source-accounts/depecrated-source-accounts.component';
import { DepecratedApproversAndControllersComponent } from '../../shared/components/depecrated-approvers-and-controllers/depecrated-approvers-and-controllers.component';


@Component({
  selector: 'app-transfer-abroad-confirm',
  standalone: false,
  templateUrl: './transfer-abroad-confirm.component.html',
  styleUrls: ['./transfer-abroad-confirm.component.css'],
  providers: [TransfersAbroadService]
})
export class TransferAbroadConfirmComponent implements OnInit {

  batch!: number;
  transfer: TransferAbroadResult = new TransferAbroadResult();
  transferSave: TransferAbroadDto = new TransferAbroadDto();
  sourceAccountRequest = new AccountDto();
  approversRequest: InputApprovers = new InputApprovers();
  types: string[] = ['P'];
  isVisibleToken = false;
  isTokenFormDisabled = false;
  isDisabledForm = false;
  isTransferSuccessful = false;

  @ViewChild(DepecratedSourceAccountsComponent) sourceComponent: DepecratedSourceAccountsComponent;
  @ViewChild(DepecratedApproversAndControllersComponent) approversComponent!: DepecratedApproversAndControllersComponent;

  constructor(private router: Router,
    private transfersAbroadService: TransfersAbroadService,
    private globalService: GlobalService,
    private dataService: DataService) {
    this.sourceComponent = new DepecratedSourceAccountsComponent(this.globalService);
  }

  ngOnInit() {
    if (this.dataService.serviceData) {
      this.batch = this.dataService.serviceData;
      this.LoadTransferAbroadResult();
    } else {
      this.router.navigate(['/transfers/transfer-abroad']);
      return;
    }

    this.sourceAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      operationTypeId: [OperationType.transAlExteriorConCambioD],
      roleId: Roles.initiator,
      types: this.types
    });
  }

  LoadTransferAbroadResult() {
    const transfer: GetTransferAbroadDto = new GetTransferAbroadDto({ batch: this.batch });
    this.transfersAbroadService
      .getTransferAbroad(transfer)
      .subscribe({next: (res: TransferAbroadResult) => {
        this.transfer = res;
        this.sourceComponent.sourceComponent.getAccounts();
      }, error: _err => {
        this.globalService.danger('Servicio de Transferencias al Exterior', _err.message);
      }});
  }

  handleSourceAccountChanged($event: AccountResult) {
    this.approversRequest = new InputApprovers({
      isAuthorizerControl: $event.isAuthorizerControl,
      accountId: this.transfer.accountId,
      operationTypeId: OperationType.transAlExteriorConCambioD,
      accountNumber: $event.formattedNumber
    });
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.transferSave.controllers = $event.controllers;
    this.transferSave.approvers = $event.approvers;
    this.transferSave.cismartApprovers = $event.cismartApprovers;
  }

  handleFormTransfer() {
    this.dataService.serviceData = this.batch;
    this.router.navigate(['/transfers/transfer-abroad-detail']);
  }

  handleShowToken() {
    this.showToken();
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.transferSave.tokenCode = $event.code;
    this.transferSave.tokenName = $event.name;
    this.saveTransfer();
  }

  saveTransfer() {
    this.transferSave.processBatchId = this.batch;
    this.transferSave.amount = this.transfer.amount;
    this.transferSave.currency = this.transfer.currency;
    this.transferSave.sourceAccount = this.transfer.sourceAccount;
    this.isTokenFormDisabled = true;
    this.transfersAbroadService.saveTransfer(this.transferSave)
      .subscribe({next: (response: any) => {
        const processBatchNumber = response.processBatchId;
        this.globalService.success('Operación realizada', `${Constants.successfulTransactionMessage} ${processBatchNumber}.`, true);
        this.isDisabledForm = this.isTransferSuccessful = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.globalService.danger('', _err);
        this.isTokenFormDisabled = false;
      }});
  }

  handleEmails($event: EmailInputModel) {
    this.transferSave.sendVouchers = $event.isEmailInputSelected ? $event.emails : '';
  }

  validate(emailInput: boolean, approversAndControllers: boolean, validateApproversLimit: boolean) {
    return emailInput && approversAndControllers && validateApproversLimit;
  }

  showToken() {
    this.approversComponent.validationCismart()
      .subscribe({next: res => {
        if (res) {
          this.isVisibleToken = true;
        }
      }});
  }
}
