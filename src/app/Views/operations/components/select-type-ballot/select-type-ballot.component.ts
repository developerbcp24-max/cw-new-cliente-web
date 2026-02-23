import { Component, OnInit, forwardRef, ViewChild, Input } from '@angular/core';
import { NgForm, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
@Component({
  selector: 'app-select-type-ballot',
  standalone: false,
  templateUrl: './select-type-ballot.component.html',
  styleUrls: ['./select-type-ballot.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectTypeBallotComponent),
    multi: true
  }]
})
export class SelectTypeBallotComponent implements OnInit, ControlValueAccessor {
  type!: string;
  @Input() disabled = false;
  @ViewChild('formComponent') form!: NgForm;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    // Esperar a que el ViewChild esté inicializado
    Promise.resolve().then(() => {
      if (this.form && this.form.valueChanges) {
        this.form.valueChanges.subscribe(() => {
          this.propagateChange(this.type);
        });
      }
    });
  }

  handleValidate(): boolean {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid!;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.type = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void {
    //not more
  }

  propagateChange = (_: any) => {
    //not more
  };

}
