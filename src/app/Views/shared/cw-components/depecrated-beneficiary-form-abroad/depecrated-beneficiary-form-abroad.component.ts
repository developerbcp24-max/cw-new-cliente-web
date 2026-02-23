import { Component, OnInit, Input, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { ParameterDocumentTypeResult } from '../../../../Services/transfers-abroad/models/parameter-document-type-result';
import { BeneficiaryAbroadData } from '../../../../Services/transfers-abroad/models/beneficiary-abroad-data';
import { NgForm, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-depecrated-beneficiary-form-abroad',
  standalone: false,
  templateUrl: './depecrated-beneficiary-form-abroad.component.html',
  styleUrls: ['./depecrated-beneficiary-form-abroad.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DepecratedBeneficiaryFormAbroadComponent),
    multi: true
  }]
})
export class DepecratedBeneficiaryFormAbroadComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  beneficiary: BeneficiaryAbroadData = new BeneficiaryAbroadData();
  @Input() documentTypes: ParameterDocumentTypeResult[] = [];
  @Input() disabled = false;
  isTicketCommissionGenerate!: boolean;
  @ViewChild('formBeneficiary') form!: NgForm;

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    // En Angular 15+ (incluyendo Angular 19), ViewChild no está disponible en ngOnInit.
    // Debes usar ngAfterViewInit para acceder a this.form y sus valueChanges.
  }

  ngAfterViewInit() {
    if (this.form?.valueChanges) {
      this.form.valueChanges.subscribe({
        next: () => {
          this.propagateChange(this.beneficiary);
        }
      });
    }
  }

  handleValidate(): boolean {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid!;
  }

  handleViewJordania() {
    window.open('assets/pdf/Concepto_de_pago.pdf', '_blank');
  }

  writeValue(obj: any): void {
    if (obj) {
      this.beneficiary = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => { };

}
