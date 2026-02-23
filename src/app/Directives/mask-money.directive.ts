import { Directive, Input, ElementRef, Inject, Provider, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[mask-money]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onTouched($event)',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskMoneyDirective),
    multi: true
  }],
  standalone: false
})

export class MaskMoneyDirective implements ControlValueAccessor {

  constructor(@Inject(Renderer2) private renderer: Renderer2, @Inject(ElementRef) private element: ElementRef) { }
  integerPart: string = '';
  decimalPart: string = '';
  maskedValue: string = '';

  writeValue(value: any) {
    if (value === undefined || value === null) {
      this.renderer.setProperty(this.element.nativeElement, 'value', '');
    } else {
      this.maskValue(value);
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.maskValue(input.value);
    }
  }

  maskValue(value: any) {
    const unmaskedValue = value.toString().replace(new RegExp(/[^.\d]/, 'g'), '');
    this.integerPart = unmaskedValue.split('.')[0];
    this.decimalPart = unmaskedValue.split('.')[1];
    this.maskedValue = '';
    this.addCommas();
    if (this.decimalPart !== undefined) {
      this.maskedValue = this.maskedValue + '.' + this.decimalPart.slice(0, 2);
      this.propagateChange(this.integerPart + '.' + this.decimalPart.slice(0, 2));
    } else {
      this.propagateChange(this.integerPart);
    }
    this.renderer.setProperty(this.element.nativeElement, 'value', this.maskedValue);
  }

  addCommas() {
    let cont = 0;
    for (let i = this.integerPart.length; i > 0; i--) {
      if (cont === 2 && i > 1) {
        this.maskedValue = ',' + this.integerPart.slice(i - 1, i) + this.maskedValue;
        cont = 0;
      } else {
        this.maskedValue = this.integerPart.slice(i - 1, i) + this.maskedValue;
        cont++;
      }
    }
  }

  propagateChange = (_: any) => { console.log(''); };

  registerOnChange(fn : any) {
    this.propagateChange = fn;
  }

  public onTouched: any = () => { console.log(''); };

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
