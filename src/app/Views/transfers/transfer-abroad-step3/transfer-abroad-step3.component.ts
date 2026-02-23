import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TransferAbroadDetailDto } from '../../../Services/transfers-abroad/models/transfer-abroad-detail-dto';
import { TransfersAbroadService } from '../../../Services/transfers-abroad/transfer-abroad.service';
import { TransferAbroadResult } from '../../../Services/transfers-abroad/models/transfer-abroad-result';
import { TransferAbroadDto } from '../../../Services/transfers-abroad/models/transfer-abroad-dto';
import { AccountDto } from '../../../Services/accounts/models/account-dto';
import { GlobalService } from '../../../Services/shared/global.service';
import { Router } from '@angular/router';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { GetTransferAbroadDto } from '../../../Services/transfers-abroad/models/get-transfer-abroad-dto';
import { Constants } from '../../../Services/shared/enums/constants';
import { SourceAccountsComponent } from '../../shared/cw-components/source-accounts/source-accounts.component';
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { UifcwDto } from '../../../Services/uif/models/uifcw-dto';
import { UifService } from '../../../Services/uif/uif.service';

@Component({
  selector: 'app-transfer-abroad-step3',
  standalone: false,
  templateUrl: './transfer-abroad-step3.component.html',
  styleUrls: ['./transfer-abroad-step3.component.css'],
  providers: [TransfersAbroadService, UifService]
})
export class TransferAbroadStep3Component implements OnInit, AfterViewInit {

  showMessage = true;
  showMessageIsBlock = false;
  transfer: TransferAbroadResult = new TransferAbroadResult();
  transferSave: TransferAbroadDto = new TransferAbroadDto();
  sourceAccountRequest = new AccountDto();
  types: string[] = ['P'];
  isVisibleToken = false;
  isTokenFormDisabled = false;
  isTransferSuccessful = false;
  showFundsDestination = false;
  uifDates: UifcwDto = new UifcwDto();
  constants: Constants = new Constants;
  @Input() detail: TransferAbroadDetailDto = new TransferAbroadDetailDto();
  @Input()
  formattedAccount!: string;
  @Input() namesApprovers: any[] = [];
  @ViewChild(SourceAccountsComponent) sourceComponent: SourceAccountsComponent;
  @Output() onPreviusForm = new EventEmitter();
  @Input()resultFunds!: TransferAbroadDto;
  asingature: any;
  is_asingature!: boolean;
  processBatchNumber!: number;
  isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;

  constructor(private router: Router, private uifService: UifService,
    private transfersAbroadService: TransfersAbroadService,
    private globalService: GlobalService) {
    this.sourceComponent = new SourceAccountsComponent(this.globalService);
    this.sourceAccountRequest = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      operationTypeId: [OperationType.transAlExteriorConCambioD],
      roleId: Roles.initiator,
      types: this.types
    });
    window.scrollTo(0, 0);
    this.transferSave.operationTypeId = OperationType.transAlExteriorConCambioD;
  }

  ngOnInit() {
    this.transferSave.uif = this.resultFunds.uif;
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    if (!(this.detail.processBatchId > 0)) {
      this.router.navigate(['/transfers/transfer-abroad']);
      return;
    } else {
      this.LoadTransferAbroadResult();
    }
  }

  ngAfterViewInit(): void {
  }

  LoadTransferAbroadResult() {
    const transfer: GetTransferAbroadDto = new GetTransferAbroadDto({ batch: this.detail.processBatchId });
    this.transfersAbroadService
      .getTransferAbroad(transfer)
      .subscribe({next: (res: TransferAbroadResult) => {
        this.transfer = res;
        this.uifDates.accountNumber = res.sourceAccountFormat;
        this.uifDates.amount = res.amount;
        this.uifDates.currency = res.currency;
        this.uifDates.exchangeRate = res.isTicket ? res.preferentialExchange : res.exchangeBuy;
        this.uifDates.causalTransaction = 'TREXT';
        this.uifDates.typeTransaction = 'LAVA';
        this.sourceComponent.sourceComponent.getAccounts();
      }, error: _err => {
        this.globalService.danger('Servicio de Transferencias al Exterior', _err.message);
      }});
  }

  handleShowToken(validateToken: boolean) {
    this.isVisibleToken = validateToken ? false : true;
    if (validateToken) {
      this.transferSave.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    if (!this.transferSave.isPrePreparer) {
      this.transferSave.tokenCode = $event.code;
      this.transferSave.tokenName = $event.name;
    }
    this.saveTransfer();
  }

  saveTransfer() {
    this.transferSave.processBatchId = this.detail.processBatchId;
    this.transferSave.amount = this.transfer.amount;
    this.transferSave.currency = this.transfer.currency;
    this.transferSave.sourceAccount = this.transfer.sourceAccount;
    this.isTokenFormDisabled = true;
    this.transfersAbroadService.saveTransfer(this.transferSave)
      .subscribe({next: (response: any) => {
        this.processBatchNumber = response.processBatchId;
        this.isTransferSuccessful = true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
      }, error: _err => {
        this.globalService.danger('', _err);
        this.isTokenFormDisabled = false;
      }});
  }

  handleForm() {
    this.onPreviusForm.emit();
  }

}
