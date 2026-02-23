import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AccountInformation } from '../../../../Services/mass-payments/Models/payment-ach/account-information';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { SaveFavorite } from '../../../../Services/shared/models/save-favorite';

@Component({
  selector: 'app-interbank-accounts',
  standalone: false,
  templateUrl: './interbank-accounts.component.html',
  styleUrls: ['./interbank-accounts.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InterbankAccountsComponent,
    multi: true
  }]
})
export class InterbankAccountsComponent implements OnInit, ControlValueAccessor {

  @Input() branchOffices!: ParameterResult[];
  @Input() banks!: ParameterResult[];
  @Input() disabled = false;
  @Output() onAccountChange: EventEmitter<AccountInformation> = new EventEmitter();
  @Output() onSaveFavoriteChange: EventEmitter<SaveFavorite> = new EventEmitter();
  @ViewChild('interbankAccountForm') form!: NgForm;
  @ViewChild('saveFavoriteForm') favoriteForm!: NgForm;
  accountInformation: AccountInformation = new AccountInformation();
  bank: ParameterResult = new ParameterResult;
  branchOffice: ParameterResult = new ParameterResult();
  favorite: SaveFavorite = new SaveFavorite();
  documentTypes!: ParameterResult[];
  documentExtensions!: ParameterResult[];
  showSaveFavoriteForm = false;

  constructor(private globalService: GlobalService, private parametersService: ParametersService) {
    this.branchOffice = undefined!;
    this.bank = undefined!;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

  selectBranchOffice() {
    this.accountInformation.branchOffice = this.branchOffice.code;
    this.accountInformation.branchOfficeDescription = this.branchOffice.description;
  }

  selectBank() {
    this.accountInformation.bank = this.bank.code;
    this.accountInformation.bankDescription = this.bank.description;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.accountInformation = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => { };

  selectDocType() {
    if (this.accountInformation.documentType !== 'C.I.') {
      this.accountInformation.documentExtension = '';
    } else {
      this.accountInformation.documentExtension = this.documentExtensions[0].code;
    }
  }

  handleCancelFavorite() {
    this.favorite.name = undefined!;
    this.favorite.isFavorite = false;
    this.showSaveFavoriteForm = false;
    this.onSaveFavoriteChange.emit(this.favorite);
  }

  handleSaveFavorite() {
    this.globalService.validateAllFormFields(this.favoriteForm.form);
    if (this.favoriteForm.valid) {
      this.favorite.isFavorite = true;
      this.showSaveFavoriteForm = false;
      this.onSaveFavoriteChange.emit(this.favorite);
    }
  }

}
