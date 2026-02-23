import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AccountsService } from '../../../../Services/accounts/accounts.service';
import { AccountNumberDto } from '../../../../Services/accounts/models/account-number-dto';
import { AccountOwnerResult } from '../../../../Services/accounts/models/account-owner-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { SaveFavorite } from '../../../../Services/shared/models/save-favorite';

@Component({
  selector: 'app-search-accounts',
  standalone: false,
  templateUrl: './search-accounts.component.html',
  styleUrls: ['./search-accounts.component.css'],
  providers: [AccountsService]
})
export class SearchAccountsComponent implements OnInit, OnChanges {

  request: AccountNumberDto = new AccountNumberDto();
  response: AccountOwnerResult = new AccountOwnerResult();
  favorite: SaveFavorite = new SaveFavorite();
  showSaveFavoriteForm = false;
  @Input() accountNumber!: string;
  @Input() currency!: string;
  @Input() disabled!: boolean;
  @Input() sourceCurrency!: any;
  @Input() groupIndex!: any;
  @Output() onChange: EventEmitter<AccountOwnerResult>;
  @Output() onSaveFavoriteChange: EventEmitter<SaveFavorite> = new EventEmitter();
  @ViewChild('searchAccountForm') form!: NgForm;
  @ViewChild('saveFavoriteForm') favoriteForm!: NgForm;

  constructor(private accountsService: AccountsService, private globalService: GlobalService,
    private cdRef: ChangeDetectorRef) {
    this.onChange = new EventEmitter();
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.accountNumber !== undefined && !changes.accountNumber.isFirstChange()) {
        this.request.accountNumber = this.accountNumber;
        this.handleSearch();
    }
  }

  handleAccountNumberChanged() {
    this.response.owner = undefined!;
    this.response.currency = undefined!;
    this.onChange.emit(this.response);
  }

  handleSearch() {
    this.accountsService.getOwner(this.request).subscribe({
      next: response => {
        this.response = response;
        this.response.formattedNumber = this.request.accountNumber;
        this.onChange.emit(this.response);
      }, error: _err => {
        this.response.owner = _err.message;
        this.onChange.emit(new AccountOwnerResult({
          owner: _err.message,
          isOwnerHasError: true
        }));
      }
    });
  }

  handleCancelFavorite() {
    this.favorite.name = undefined!;
    this.favorite.isFavorite = false;
    this.showSaveFavoriteForm = false;
    this.onSaveFavoriteChange.emit(this.favorite);
  }

  restart() {
    this.request.accountNumber = undefined!;
    this.response.formattedNumber = undefined!;
    this.handleAccountNumberChanged();
  }

  handleSaveFavorite() {
    this.globalService.validateAllFormFields(this.favoriteForm.form);
    if (this.favoriteForm.valid) {
      this.favorite.isFavorite = true;
      this.showSaveFavoriteForm = false;
      this.onSaveFavoriteChange.emit(this.favorite);
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.response.currency === undefined) {
      this.globalService.warning("Titular", "El número de cuenta es incorrecto, revise la información ingresada y presione 'Titular cuenta' nuevamente.", true);
      return false;
    }
    return this.form.valid;
  }
}
