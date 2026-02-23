import { Component, OnInit, ViewChild, forwardRef, Input } from '@angular/core';
import { TransferAbroadFrecuent } from '../../../../Services/transfers-abroad/models/transfer-abroad-frecuent';
import { NgForm, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-frecuent-transfer-abroad-add',
  standalone: false,
  templateUrl: './frecuent-transfer-abroad-add.component.html',
  styleUrls: ['./frecuent-transfer-abroad-add.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FrecuentTransferAbroadAddComponent),
    multi: true
  }]
})
export class FrecuentTransferAbroadAddComponent implements OnInit, ControlValueAccessor {

  frecuent: TransferAbroadFrecuent = new TransferAbroadFrecuent();
  frecuentTemp: TransferAbroadFrecuent = new TransferAbroadFrecuent();
  isAddVisible = false;
  @Input() disabled = false;
  @ViewChild('frecuentTransferFormAdd') form!: NgForm;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    /*This is intentional*/
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return (this.form.valid);
  }

  handleAddFavoriteTransfer() {
    this.frecuent.isFrecuent = true;
    this.frecuent.description = this.frecuentTemp.description;
    this.isAddVisible = false;
    this.propagateChange(this.frecuent);
  }

  handleResetFavoriteTransfer() {
    this.frecuent = new TransferAbroadFrecuent();
    this.frecuentTemp = new TransferAbroadFrecuent();
  }

  writeValue(obj: any): void {
    if (obj) {
      this.frecuent = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => { };
}
