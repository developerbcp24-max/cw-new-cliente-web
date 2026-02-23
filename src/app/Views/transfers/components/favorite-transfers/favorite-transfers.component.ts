import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FavoriteTransferResponse } from '../../../../Services/transfers/models/favorite-transfer-response';
import { FavoriteTransferRequest } from '../../../../Services/transfers/models/favorite-transfer-request';
import { FavoriteTransferIdRequest } from '../../../../Services/transfers/models/favorite-transfer-id-request';
import { TransfersService } from '../../../../Services/transfers/transfers.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
import { TransferData } from '../../../../Services/transfers/models/transfer-data';
import { PaymentAchService } from '../../../../Services/mass-payments/payment-ach.service';
import { MassPaymentFavoriteTransactions } from '../../../../Services/mass-payments/Models/mass-payment-favorite-transactions';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';
import { AccountInformation } from '../../../../Services/mass-payments/Models/payment-ach/account-information';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';

@Component({
  selector: 'app-favorite-transfers',
  standalone: false,
  templateUrl: './favorite-transfers.component.html',
  styleUrls: ['./favorite-transfers.component.css'],
  providers: [TransfersService, PaymentAchService]
})
export class FavoriteTransfersComponent implements OnInit {

  accountSelected?: AccountResult;
  isCheckedFavoriteTransfer = false;
  favoriteTransfers: FavoriteTransferResponse[] = [];
  favoriteTransfersAch: MassPaymentFavoriteTransactions[] = [];
  selectedTransfer!: FavoriteTransferResponse;
  isUpdateModalVisible = false;
  isRemoveModalVisible = false;
  request: FavoriteTransferRequest = new FavoriteTransferRequest();
  removeRequest: FavoriteTransferIdRequest = new FavoriteTransferIdRequest();
  @Input() interbankAccountInformation!: AccountInformation;
  @Input() batchInformation!: TransferData;
  @Input() disabled = false;
  @ViewChild('favoriteTransfersForm') form!: NgForm;

  constructor(private transferService: TransfersService, private globalService: GlobalService, private achService: PaymentAchService) { }

  ngOnInit() {
    this.selectedTransfer = null!;
  }

  handleGetFavorite() {
    this.transferService.getFavorites()
    .subscribe({next: response => this.favoriteTransfers = response,
      error: _err => this.globalService.warning('Favoritos', _err.message)});
  }

  handleChangedFavoriteTransfer() {
    this.batchInformation.amount = this.selectedTransfer.amount;
    this.batchInformation.currency = this.selectedTransfer.currency;
    this.batchInformation.sourceAccountId = this.selectedTransfer.sourceAccountId;
    if (this.selectedTransfer.isAch) {
      this.interbankAccountInformation.bank = this.selectedTransfer.bankId;
      this.interbankAccountInformation.bankDescription = this.selectedTransfer.bank;
      this.interbankAccountInformation.beneficiary = this.selectedTransfer.beneficiary;
      this.interbankAccountInformation.branchOffice = this.selectedTransfer.branchOfficeId;
      this.interbankAccountInformation.branchOfficeDescription = this.selectedTransfer.branchOffice;
      this.interbankAccountInformation.number = this.selectedTransfer.destinationAccountNumber;
      this.batchInformation.destinationAccount = this.selectedTransfer.destinationAccountNumber;
    } else {
      this.batchInformation.destinationAccount = this.selectedTransfer.destinationAccountNumber;
    }
    this.batchInformation.isAch = this.selectedTransfer.isAch;
    this.request.id = this.selectedTransfer.id;
    this.removeRequest.id = this.selectedTransfer.id;
  }

  handleChangeChecked($event: any) {
    if (!$event) {
      this.selectedTransfer = null!;
    }
  }

  handleUpdateFavoriteTransfer() {
    this.request.currency = this.batchInformation.currency;
    this.request.amount = this.batchInformation.amount;
    this.request.sourceAccountId = this.batchInformation.sourceAccountId;
    this.request.destinationAccountNumber = this.batchInformation.destinationAccount;
    this.request.name = this.batchInformation.favoriteName;
    if (this.selectedTransfer.isAch) {
      this.transferService.updateFavoriteAch(this.request).subscribe({next: resp => {
        this.ngOnInit();
        this.isUpdateModalVisible = false;
        this.globalService.success('Favoritos', resp.toString());
      }, error: _err => this.globalService.warning('Favoritos', _err.message)});
    } else {
      this.transferService.updateFavorite(this.request)
        .subscribe({next: response => {
          this.ngOnInit();
          this.isUpdateModalVisible = false;
          this.globalService.success('Favoritos', ' La operación fue realizada con éxito');
        }, error: _err => this.globalService.warning('Favoritos', _err.message)});
    }
  }

    restart() {
      this.selectedTransfer = null!;
    }

    handleValidate() {
      this.globalService.validateAllFormFields(this.form.form);
      return this.form.valid;
    }

    handleRemoveFavoriteTransfer() {
      if (this.selectedTransfer.isAch) {
        this.achService.deleteFavorite(new MassivePaymentsSpreadsheetsDto({ id: this.selectedTransfer.id }))
        .subscribe({next: resp => {
          this.ngOnInit();
          this.isRemoveModalVisible = false;
          this.globalService.success('Favoritos: ', resp.statusOperation);
        }, error: _err => this.globalService.warning('Favoritos ', _err.message)});
      } else {
        this.transferService.removeFavorite(this.removeRequest)
          .subscribe({next: response => {
            this.ngOnInit();
            this.isRemoveModalVisible = false;
            this.globalService.success('Favoritos: ', response.toString());
          }, error: _err => this.globalService.warning('Favoritos ', _err.message)});
      }
    }
  }
