import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-favorite-payment-modal',
  standalone: false,
  templateUrl: './favorite-payment-modal.component.html',
  styleUrls: ['./favorite-payment-modal.component.css']
})
export class FavoritePaymentModalComponent implements OnInit {

  @Input() showSaveFavoriteForm = false;
  @Input() favoriteName!: string;
  @Output() onChangeFavorite: EventEmitter<any>;
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  isFavorite = false;
  arrayFavorite: any[] = [];

  constructor(private globalService: GlobalService) {
    this.onChangeFavorite = new EventEmitter();
  }

  ngOnInit() {
    /*This is intentional*/
  }

  handleSaveFavorite() {
    this.arrayFavorite = [];
    this.globalService.validateAllFormFields(this.saveFavoriteForm.form);
    if (this.saveFavoriteForm.valid) {
      this.isFavorite = true;
      this.showSaveFavoriteForm = false;
    }
    this.arrayFavorite.push({isFavorite: this.isFavorite, showModal: this.showSaveFavoriteForm, nameFav: this.favoriteName});
    this.onChangeFavorite.emit(this.arrayFavorite);
  }

  handleCancel() {
    this.showSaveFavoriteForm = false;
    this.onChangeFavorite.emit(this.showSaveFavoriteForm);
  }

}
