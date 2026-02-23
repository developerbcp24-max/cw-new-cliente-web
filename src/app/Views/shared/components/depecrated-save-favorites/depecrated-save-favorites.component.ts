import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { SaveFavorite } from '../../../../Services/shared/models/save-favorite';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-depecrated-save-favorites',
  standalone: false,
  templateUrl: './depecrated-save-favorites.component.html',
  styleUrls: ['./depecrated-save-favorites.component.css']
})
export class DepecratedSaveFavoritesComponent implements OnInit {

  data: SaveFavorite;
  @Output() onChange: EventEmitter<SaveFavorite>;
  @Input() title!: string;
  @Input() disabled: boolean;
  @Input() visible = true;
  @ViewChild('saveFavoritesForm') form!: NgForm;

  constructor(private globalService: GlobalService) {
    this.disabled = false;
    this.onChange = new EventEmitter();
    this.data = new SaveFavorite();
  }

  ngOnInit() {
    this.data.name = '';
  }

  handleFavoriteNameChanged() {
    this.onChange.emit(this.data);
  }

  handleChangeChecked($event: boolean) {
    if (!$event) {
      this.data = new SaveFavorite();
      this.onChange.emit(this.data);
    }
  }

  handleValidate() {
    if (!this.visible) {
      return true;
    }
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

}
