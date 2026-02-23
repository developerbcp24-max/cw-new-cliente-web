import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EqualValidatorDirective } from './validateequal.directive';
import { OnlyNumberDirective } from './only-number.directive';
import { OnlyIntegerDirective } from './only-integer.directive';
import { ValidateDirective } from './validate.directive';
import { MaxLengthDirective } from './max-length.directive';
import { MaskMoneyDirective } from './mask-money.directive';
import { OnlyAlphanumericNotSymbolsDirective } from './only-alphanumeric-not-symbols.directive';
import { OnlyTypeDirective } from './only-type.directive';

@NgModule({
  imports: [
    CommonModule,
    /* FormsModule,
    ReactiveFormsModule */
  ],
  declarations: [
    EqualValidatorDirective,
    OnlyNumberDirective,
    OnlyIntegerDirective,
    ValidateDirective,
    MaxLengthDirective,
    MaskMoneyDirective,
    OnlyAlphanumericNotSymbolsDirective,
    OnlyTypeDirective
  ],
  exports: [
    /* FormsModule,
    ReactiveFormsModule, */
    EqualValidatorDirective,
    OnlyNumberDirective,
    OnlyIntegerDirective,
    ValidateDirective,
    MaxLengthDirective,
    MaskMoneyDirective,
    OnlyAlphanumericNotSymbolsDirective,
    OnlyTypeDirective
  ]
})
export class DirectivesModule {}
