import { Component, OnInit, Output, EventEmitter, Input, ViewChild, SimpleChanges } from '@angular/core';
import { ElfecService } from '../../../../Services/elfec/elfec.service';
import { ElfecRequest } from '../../../../Services/elfec/models/elfec-request';
import { FavoriteElfecResult } from '../../../../Services/elfec/models/favorite-elfec-result';
import { FavoriteElfecIdDto } from '../../../../Services/elfec/models/favorite-elfec-id-dto';
import { SaveFavorite } from '../../../../Services/shared/models/save-favorite';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
import { ElfecDto } from '../../../../Services/elfec/models/elfec-dto';
import { ElfecDebtResponse } from '../../../../Services/elfec/models/elfec-debt-response';

@Component({
  selector: 'app-invoice-code',
  standalone: false,
  templateUrl: './invoice-code.component.html',
  styleUrls: ['./invoice-code.component.css'],
  providers: [ElfecService]
})
export class InvoiceCodeComponent implements OnInit {

  getDebtRequest: ElfecRequest = new ElfecRequest();
  @Input() detail!: ElfecDebtResponse;
  listFavorite: FavoriteElfecResult[] = [];
  favoriteNameNus!: FavoriteElfecResult;
  selectedFavorite!: FavoriteElfecResult;
  showSaveFavoriteForm = false;
  existFavorites = false;
  favorite: SaveFavorite = new SaveFavorite();
  elfecDto = new ElfecDto();
  @Input() disabledFav = true;
  showMessageError = false;
  @Output() onChange: EventEmitter<any>;
  @Output() onChangeElfecDto = new EventEmitter();
  @Output() onNewSearch: EventEmitter<any>;
  @Input() disabled!: boolean;
  @Output() onFavoriteChanged: EventEmitter<SaveFavorite> = new EventEmitter();
  @ViewChild('favoriteForm') favoriteForm!: NgForm;
  @ViewChild('saveFavoriteForm') saveFavoriteForm!: NgForm;
  @ViewChild('elfecForm') elfecForm!: NgForm;

  constructor(private elfecService: ElfecService, private globalService: GlobalService) {
    this.onChange = new EventEmitter();
    this.onNewSearch = new EventEmitter();
  }

  ngOnInit() {
    this.handleGetFavorite();
  }

  /*ngOnChanges(changes: SimpleChanges): void {
    if (!this.disabledFav && this.detail !== null) {
        this.disabledFav = true;
    }
  }*/

  handleChangeInput() {
    this.showMessageError = false;
  }

  handleGetDebts() {
    this.onNewSearch.emit();
    this.elfecDto.nus = this.getDebtRequest.nus;
    this.elfecDto.accountNumber = this.getDebtRequest.accountNumber;
    this.globalService.validateAllFormFields(this.elfecForm.form);
    if (this.elfecForm.valid) {
      this.elfecService.getDebts(this.getDebtRequest)
        .subscribe({next: (response: any) => {
          this.detail = response;
          this.showMessageError = this.detail === null ? true : false;
          this.disabledFav = this.detail === null ? true : false;
          this.onChange.emit(this.detail);
          this.onChangeElfecDto.emit(this.elfecDto);
        }, error: _err => { this.globalService.danger('Deudas Elfec', _err); }});
    }
  }

  handleGetFavorite() {
    this.elfecService.getFavorite()
      .subscribe({next: (response: FavoriteElfecResult[]) => {
        this.listFavorite = response;
        this.existFavorites = this.listFavorite.length > 0 ? true : false;
      }, error: _err => { this.globalService.danger('Favoritos', _err); }});
  }

  handleShowFavorite() {
    this.globalService.validateAllFormFields(this.elfecForm.form);
    if (this.elfecForm.valid) {
      this.showSaveFavoriteForm = true;
    }
  }

  handleFavoriteById($event: FavoriteElfecResult) {
    this.elfecService.getFavoriteById(new FavoriteElfecIdDto({ id: $event.id }))
      .subscribe({next: (response: any) => {
        this.selectedFavorite = response;
        this.getDebtRequest.nus = response.nus;
        this.getDebtRequest.accountNumber = response.accountNumber;
        this.detail = undefined!;
      }, error: _err => { this.globalService.danger('Favoritos', _err); }});
  }

  handleSaveFavorite() {
    this.globalService.validateAllFormFields(this.saveFavoriteForm.form);
    if (this.saveFavoriteForm.valid) {
      this.favorite.isFavorite = true;
      this.showSaveFavoriteForm = false;
      this.onFavoriteChanged.emit(this.favorite);
    }
  }

  handleRemove() {
    this.elfecService.deleteFavoriteById(new FavoriteElfecIdDto({ id: this.selectedFavorite.id }))
      .subscribe({next: (response: any) => {
        this.handleGetFavorite();
        this.disabledFav = true;
        this.getDebtRequest.nus = undefined!;
        this.getDebtRequest.accountNumber = undefined!;
        this.favoriteNameNus = this.detail = this.selectedFavorite = undefined!;
        this.globalService.info('Pago Elfec', 'El pago se eliminó correctamente.');
      }, error: _err => {
      }});
  }

  handleCancelFavorite() {
    this.favorite.name = undefined!;
    this.favorite.isFavorite = false;
    this.showSaveFavoriteForm = false;
    this.onFavoriteChanged.emit(this.favorite);
  }

}
