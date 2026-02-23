import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GetDebtRequest } from '../../../../Services/service-payments/models/get-debt-request';
import { GetFavorites } from '../../../../Services/service-payments/models/get-favorites';
import { ServicePaymentsService } from '../../../../Services/service-payments/service-payments.service';
import { ServiceTypes } from '../../../../Services/shared/enums/service-types';
import { GlobalService } from '../../../../Services/shared/global.service';
import { FavoritePayment } from '../../../../Services/shared/models/favorite-payment';
import { SaveFavorite } from '../../../../Services/shared/models/save-favorite';

@Component({
  selector: 'app-client-code',
  standalone: false,
  templateUrl: './client-code.component.html',
  styleUrls: ['./client-code.component.css'],
  providers: [ServicePaymentsService]
})
export class ClientCodeComponent implements OnInit, OnChanges {

  getDebtRequest: GetDebtRequest;
  errorMessage: string = '';
  serviceTypes = ServiceTypes;
  showSaveFavoriteForm = false;
  showGetFavorite = false;
  favorites: FavoritePayment[];
  selectedFavorite!: FavoritePayment;
  detail: any;
  favorite: SaveFavorite = new SaveFavorite();
  @Input() service!: string;
  @Input() disabled!: boolean;
  @Output() onChange: EventEmitter<any>;
  @Output() onNewSearch: EventEmitter<any>;
  @Output() onCheckedChange: EventEmitter<boolean>;
  @Output() onFavoriteChanged: EventEmitter<SaveFavorite> = new EventEmitter();
  @ViewChild('clientCodeForm') form!: NgForm;
  @ViewChild('saveFavoriteForm') favoriteForm!: NgForm;

  constructor(private servicePayment: ServicePaymentsService, private globalService: GlobalService) {
    this.getDebtRequest = new GetDebtRequest();
    this.onChange = new EventEmitter();
    this.onCheckedChange = new EventEmitter();
    this.onNewSearch = new EventEmitter();
    this.favorites = [];
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    this.getDebtRequest.service = this.service;
    if (changes.service !== undefined && !changes.service.isFirstChange()) {
      this.getDebtRequest.code = '';
      this.detail = undefined;
      this.favorite.isFavorite = false;
    }
  }

  getDebt() {
    this.onNewSearch.emit();
    this.servicePayment.getDebts(this.getDebtRequest)
      .subscribe({next: (response: any) => {
        this.detail = response;
        this.showGetFavorite = false;
        this.onChange.emit(response);
      }, error: _err => {
        this.showGetFavorite = false;
        this.errorMessage = _err.message;
        this.getDebtRequest.code = '';
      }});
  }

  getFavorites() {
    this.servicePayment.getFavorites(new GetFavorites({ serviceType: this.service }))
      .subscribe({next: (response: FavoritePayment[]) => {
        this.favorites = response;
        this.showGetFavorite = true;
      }, error: _err => {
        this.errorMessage = _err.message;
        this.favorite.isFavorite = false;
      }});
  }

  handleSaveFavorite() {
    this.globalService.validateAllFormFields(this.favoriteForm.form);
    if (this.favoriteForm.valid) {
      this.favorite.isFavorite = true;
      this.showSaveFavoriteForm = false;
      this.onFavoriteChanged.emit(this.favorite);
    }
  }

  handleFavoriteListChanged() {
    this.getDebtRequest.code = this.selectedFavorite.code;
    this.getDebt();
  }

  handleCancelFavorite() {
    this.favorite.name = undefined!;
    this.favorite.isFavorite = false;
    this.showSaveFavoriteForm = false;
    this.onFavoriteChanged.emit(this.favorite);
  }

  handleSearchFavoritesChanged() {
    if (this.favorite.isFavorite) {
      this.getFavorites();
    } else {
      this.onCheckedChange.emit(this.favorite.isFavorite);
      this.getDebtRequest.code = '';
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

}
