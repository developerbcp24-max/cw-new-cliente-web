import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'app-show-errors',
  standalone: false,
  templateUrl: './show-errors.component.html',
  styleUrl: './show-errors.component.css'
})
export class ShowErrorsComponent implements OnInit {
  private static readonly errorMessages = {
    required: () => 'Este campo es requerido',
    minlength: (params: any) =>
      'El minimo de caracteres es: ' + params.requiredLength,
    maxlength: (params: any) =>
      'El máximo de caracteres es: ' + params.requiredLength,
    pattern: (params: any) =>
      'Se requiere el siguiente formato: ' + params.requiredPattern,
    validate: (params: any) => params.message,
  };

  @Input() public control!: AbstractControlDirective | AbstractControl | any;

  constructor() {
    /*This is intentional*/
  }
  ngOnInit() {}

  shouldShowErrors(): boolean {
    return (
      this.control! &&
      this.control.errors! &&
      (this.control.dirty! || this.control.touched!)
    );
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors!).map((field) =>
      this.getMessage(field, this.control.errors![field])
    );
  }

  private getMessage(type: string, params: any): any {
    if (type === 'required') {
      return ShowErrorsComponent.errorMessages.required();
    } else if (type == 'minlength') {
      return ShowErrorsComponent.errorMessages.minlength(params);
    } else if (type == 'maxlength') {
      return ShowErrorsComponent.errorMessages.maxlength(params);
    } else if (type == 'pattern') {
      return ShowErrorsComponent.errorMessages.pattern(params);
    } else if (type == 'validate') {
      return ShowErrorsComponent.errorMessages.validate(params);
    }
  }

  get getControl() {
    return this.control;
  }
}
